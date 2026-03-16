package com.transaction.accountsystem.controller;

import com.transaction.accountsystem.dto.TransactionRequestDTO;
import com.transaction.accountsystem.dto.TransferRequestDTO;
import com.transaction.accountsystem.entity.Transaction;
import com.transaction.accountsystem.service.TransactionService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // Deposit API
    @PostMapping("/deposit")
    public String deposit(@RequestBody TransactionRequestDTO request){
        return transactionService.deposit(request);
    }

    // Withdraw API
    @PostMapping("/withdraw")
    public String withdraw(@RequestBody TransactionRequestDTO request){
        return transactionService.withdraw(request);
    }

    // Transfer API
    @PostMapping("/transfer")
    public String transfer(@RequestBody TransferRequestDTO request){
        return transactionService.transfer(request);
    }

    // Transaction history
    @GetMapping("/account/{accountId}")
    public List<Transaction> getTransactions(@PathVariable Long accountId){
        return transactionService.getTransactionsByAccount(accountId);
    }
}