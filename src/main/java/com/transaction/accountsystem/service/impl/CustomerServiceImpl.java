package com.transaction.accountsystem.service.impl;

// import com.transaction.accountsystem.entity.Account;
import com.transaction.accountsystem.entity.Customer;
import com.transaction.accountsystem.repository.AccountRepository;
import com.transaction.accountsystem.repository.CustomerRepository;
import com.transaction.accountsystem.service.CustomerService;

import org.springframework.stereotype.Service;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository,
                               AccountRepository accountRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public Customer createCustomer(Customer customer) {

        return customerRepository.save(customer);
    }


    
}