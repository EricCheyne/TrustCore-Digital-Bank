package com.trustcore.banking.controller;

import com.trustcore.banking.dto.TransferRequest;
import com.trustcore.banking.model.Account;
import com.trustcore.banking.model.Transaction;
import com.trustcore.banking.service.BankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/banking")
@RequiredArgsConstructor
public class BankingController {

    private final BankingService bankingService;

    @GetMapping("/accounts")
    public ResponseEntity<List<Account>> getAccounts(Authentication authentication) {
        return ResponseEntity.ok(bankingService.getAccountsByUsername(authentication.getName()));
    }

    @PostMapping("/accounts")
    public ResponseEntity<Account> createAccount(Authentication authentication, @RequestBody Map<String, String> request) {
        String currency = request.getOrDefault("currency", "USD");
        return ResponseEntity.ok(bankingService.createAccount(authentication.getName(), currency));
    }

    @PostMapping("/transfer")
    public ResponseEntity<Transaction> transfer(Authentication authentication, @RequestBody TransferRequest request) {
        return ResponseEntity.ok(bankingService.transfer(
                authentication.getName(),
                request.getFromAccountNumber(),
                request.getToAccountNumber(),
                request.getAmount(),
                request.getDescription()
        ));
    }

    @GetMapping("/accounts/{accountNumber}/transactions")
    public ResponseEntity<List<Transaction>> getTransactions(@PathVariable String accountNumber) {
        return ResponseEntity.ok(bankingService.getTransactionHistory(accountNumber));
    }

    // For demonstration/testing: deposit funds
    @PostMapping("/accounts/{accountNumber}/deposit")
    public ResponseEntity<Void> deposit(@PathVariable String accountNumber, @RequestBody Map<String, BigDecimal> request) {
        bankingService.deposit(accountNumber, request.get("amount"));
        return ResponseEntity.ok().build();
    }
}
