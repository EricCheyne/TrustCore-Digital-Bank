package com.trustcore.banking.service;

import com.trustcore.banking.model.Account;
import com.trustcore.banking.model.Transaction;
import com.trustcore.banking.repository.AccountRepository;
import com.trustcore.banking.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BankingService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

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
        return transactionRepository.save(transaction);
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
    }
}
