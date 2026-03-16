package com.transaction.accountsystem.service;

import com.transaction.accountsystem.dto.TransactionRequestDTO;
import com.transaction.accountsystem.dto.TransferRequestDTO;
import com.transaction.accountsystem.entity.Transaction;

import java.util.List;

public interface TransactionService {

    String deposit(TransactionRequestDTO request);

    String withdraw(TransactionRequestDTO request);

    String transfer(TransferRequestDTO request);

    List<Transaction> getTransactionsByAccount(Long accountId);
}