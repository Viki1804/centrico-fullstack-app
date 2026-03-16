package com.transaction.accountsystem.controller;

import com.transaction.accountsystem.entity.Account;
import com.transaction.accountsystem.service.AccountService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/{accountId}")
    public Account getAccount(@PathVariable Long accountId){
        return accountService.getAccountById(accountId);
    }

    @GetMapping("/customer/{customerId}")
    public Account getAccountByCustomer(@PathVariable String customerId) {
    return accountService.getAccountByCustomer(customerId);
    }

    // @GetMapping("/all")
    // public List<Account> getAllAccounts(){
    //     return accountService.getAllAccounts();
    // }

}