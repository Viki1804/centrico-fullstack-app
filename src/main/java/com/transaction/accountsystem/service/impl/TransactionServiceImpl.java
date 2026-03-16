package com.transaction.accountsystem.service.impl;

import com.transaction.accountsystem.dto.TransactionRequestDTO;
import com.transaction.accountsystem.dto.TransferRequestDTO;
import com.transaction.accountsystem.entity.Transaction;
import com.transaction.accountsystem.repository.TransactionRepository;
import com.transaction.accountsystem.service.TransactionService;
import com.transaction.accountsystem.service.strategy.TransactionStrategy;
import com.transaction.accountsystem.service.strategy.TransactionStrategyFactory;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionStrategyFactory strategyFactory;
    private final TransactionRepository transactionRepository;

    public TransactionServiceImpl(TransactionStrategyFactory strategyFactory,
                                  TransactionRepository transactionRepository) {
        this.strategyFactory = strategyFactory;
        this.transactionRepository = transactionRepository;
    }

    @Override
    public String deposit(TransactionRequestDTO request) {

        TransactionStrategy strategy = strategyFactory.getStrategy("DEPOSIT");

        return strategy.process(request);
    }

    @Override
    public String withdraw(TransactionRequestDTO request) {

        TransactionStrategy strategy = strategyFactory.getStrategy("WITHDRAW");

        return strategy.process(request);
    }

 @Override
public String transfer(TransferRequestDTO request) {

    TransactionStrategy strategy = strategyFactory.getStrategy("TRANSFER");

    return strategy.processTransfer(request);
}
    @Override
    public List<Transaction> getTransactionsByAccount(Long accountId) {

        return transactionRepository.findByAccountAccountId(accountId);
    }
}