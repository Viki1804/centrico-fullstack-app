package com.transaction.accountsystem.service.impl;

import com.transaction.accountsystem.entity.Account;
import com.transaction.accountsystem.exception.ResourceNotFoundException;
import com.transaction.accountsystem.repository.AccountRepository;
import com.transaction.accountsystem.service.AccountService;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;

    public AccountServiceImpl(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public Account getAccountById(Long accountId) {
        
        //Custom Exception folder
        return accountRepository.findById(accountId)
        .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
    }
    
    @Override
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }
    @Override
    public Account getAccountByCustomer(String customerId){
    return accountRepository.findByCustomerCustomerId(customerId);
}
    
}