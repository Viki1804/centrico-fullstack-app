package com.transaction.accountsystem.service.strategy;

import com.transaction.accountsystem.dto.TransferRequestDTO;
import com.transaction.accountsystem.entity.Account;
import com.transaction.accountsystem.entity.Transaction;
import com.transaction.accountsystem.exception.AccountInactiveException;
import com.transaction.accountsystem.exception.InsufficientBalanceException;
import com.transaction.accountsystem.repository.AccountRepository;
import com.transaction.accountsystem.repository.TransactionRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class TransferStrategy implements TransactionStrategy {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public TransferStrategy(AccountRepository accountRepository,
                            TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    @Transactional
    public String processTransfer(TransferRequestDTO request) {

        Account source = accountRepository.findById(request.getSourceAccountId())
                .orElseThrow(() -> new RuntimeException("Source account not found"));

        Account destination = accountRepository.findById(request.getDestinationAccountId())
                .orElseThrow(() -> new RuntimeException("Destination account not found"));
                
        //Custom Exception folder
        if(source.getBalance() < request.getAmount()){
            throw new InsufficientBalanceException("Insufficient balance");
        }
        if(!source.getStatus().equals("ACTIVE")){
            throw new AccountInactiveException("Source account is inactive");
        }
        source.setBalance(source.getBalance() - request.getAmount());

        if(!destination.getStatus().equals("ACTIVE")){
            throw new AccountInactiveException("Destination account is inactive");
        }
        destination.setBalance(destination.getBalance() + request.getAmount());

        accountRepository.save(source);
        accountRepository.save(destination);

        Transaction transaction = new Transaction();
        transaction.setTransactionId(System.currentTimeMillis());
        transaction.setType("TRANSFER");
        transaction.setAmount(request.getAmount());
        transaction.setDate(new Date());
        transaction.setAccount(source);

        transactionRepository.save(transaction);

        return "Transfer successful";
    }

    @Override
    public String process(com.transaction.accountsystem.dto.TransactionRequestDTO request) {
        throw new UnsupportedOperationException("Use processTransfer for transfer");
    }
}