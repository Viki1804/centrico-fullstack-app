package com.transaction.accountsystem.service;

import java.util.List;

import com.transaction.accountsystem.entity.Account;

public interface AccountService {

    Account getAccountById(Long accountId);
    List<Account> getAllAccounts();
    Account getAccountByCustomer(String customerId);
}
