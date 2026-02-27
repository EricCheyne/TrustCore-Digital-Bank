package com.trustcore.banking.service;

import com.trustcore.banking.model.Account;
import com.trustcore.banking.model.Transaction;
import com.trustcore.banking.repository.AccountRepository;
import com.trustcore.banking.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BankingService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final RestTemplate restTemplate;

    @Value("${app.ai-engine.url:http://ai-engine:8000}")
    private String aiEngineUrl;

    @Value("${app.audit-service.url:http://audit-service:8083}")
    private String auditServiceUrl;

    public List<Account> getAccountsByUsername(String username) {
        return accountRepository.findByUsername(username);
    }

    public Account createAccount(String username, String currency) {
        String accountNumber = "ACC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Account account = Account.builder()
                .accountNumber(accountNumber)
                .username(username)
                .balance(BigDecimal.ZERO)
                .currency(currency)
                .build();
        
        logAudit("CREATE_ACCOUNT", username, "Created account " + accountNumber);
        return accountRepository.save(account);
    }

    @Transactional
    public Transaction transfer(String username, String fromAccountNum, String toAccountNum, BigDecimal amount, String description) {
        Account fromAccount = accountRepository.findByAccountNumber(fromAccountNum)
                .orElseThrow(() -> new RuntimeException("Source account not found"));

        if (!fromAccount.getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized: You do not own the source account");
        }

        if (fromAccount.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient funds");
        }

        // AI Risk Scoring
        Map<String, Object> aiRequest = Map.of(
                "fromAccountNumber", fromAccountNum,
                "toAccountNumber", toAccountNum,
                "amount", amount,
                "description", description
        );
        try {
            Map aiResponse = restTemplate.postForObject(aiEngineUrl + "/api/ai/risk-score", aiRequest, Map.class);
            if (aiResponse != null && (Boolean) aiResponse.get("is_fraud")) {
                logAudit("TRANSFER_BLOCKED", username, "Blocked fraudulent transfer: " + aiResponse.get("risk_score"));
                throw new RuntimeException("Transaction blocked by security engine: " + aiResponse.get("recommendation"));
            }
        } catch (Exception e) {
            log.warn("AI Engine unavailable, proceeding with caution", e);
        }

        Account toAccount = accountRepository.findByAccountNumber(toAccountNum)
                .orElseThrow(() -> new RuntimeException("Destination account not found"));

        // Deduct
        fromAccount.setBalance(fromAccount.getBalance().subtract(amount));
        accountRepository.save(fromAccount);

        // Add
        toAccount.setBalance(toAccount.getBalance().add(amount));
        accountRepository.save(toAccount);

        // Record Transaction
        Transaction transaction = Transaction.builder()
                .fromAccountNumber(fromAccountNum)
                .toAccountNumber(toAccountNum)
                .amount(amount)
                .description(description)
                .timestamp(LocalDateTime.now())
                .build();
        
        Transaction saved = transactionRepository.save(transaction);
        logAudit("TRANSFER", username, "Transferred " + amount + " to " + toAccountNum);
        return saved;
    }

    private void logAudit(String action, String username, String details) {
        try {
            Map<String, Object> auditLog = Map.of(
                    "serviceName", "banking-service",
                    "action", action,
                    "username", username,
                    "details", details,
                    "timestamp", LocalDateTime.now().toString()
            );
            restTemplate.postForObject(auditServiceUrl + "/api/audit/logs", auditLog, Map.class);
        } catch (Exception e) {
            log.error("Failed to log audit event", e);
        }
    }

    public List<Transaction> getTransactionHistory(String accountNumber) {
        return transactionRepository.findByFromAccountNumberOrToAccountNumberOrderByTimestampDesc(accountNumber, accountNumber);
    }

    @Transactional
    public void deposit(String accountNumber, BigDecimal amount) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        account.setBalance(account.getBalance().add(amount));
        accountRepository.save(account);
        
        transactionRepository.save(Transaction.builder()
                .fromAccountNumber("SYSTEM")
                .toAccountNumber(accountNumber)
                .amount(amount)
                .description("Initial Deposit")
                .timestamp(LocalDateTime.now())
                .build());
        
        logAudit("DEPOSIT", account.getUsername(), "Deposited " + amount + " to " + accountNumber);
    }
}
