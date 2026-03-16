package com.transaction.accountsystem.service.strategy;

import com.transaction.accountsystem.dto.TransactionRequestDTO;
import com.transaction.accountsystem.entity.Account;
import com.transaction.accountsystem.entity.Transaction;
import com.transaction.accountsystem.exception.AccountInactiveException;
import com.transaction.accountsystem.repository.AccountRepository;
import com.transaction.accountsystem.repository.TransactionRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
public class DepositStrategy implements TransactionStrategy {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public DepositStrategy(AccountRepository accountRepository,
                           TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    @Transactional
    public String process(TransactionRequestDTO request) {

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if(request.getAmount() <= 0){
            throw new RuntimeException("Deposit amount must be greater than zero");
        }

        if(!account.getStatus().equals("ACTIVE")){
            throw new AccountInactiveException("Account is inactive");
        }

        account.setBalance(account.getBalance() + request.getAmount());

        accountRepository.save(account);

        Transaction transaction = new Transaction();

        transaction.setTransactionId(System.currentTimeMillis());
        transaction.setType("DEPOSIT");
        transaction.setAmount(request.getAmount());
        transaction.setDate(new Date());
        transaction.setAccount(account);

        transactionRepository.save(transaction);

        return "Deposit successful";
    }
}