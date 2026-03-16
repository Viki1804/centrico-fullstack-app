package com.transaction.accountsystem.security;

import com.transaction.accountsystem.entity.Customer;
import com.transaction.accountsystem.repository.CustomerRepository;

import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final CustomerRepository customerRepository;

    private final Map<String,String> users = new HashMap<>();

    public CustomUserDetailsService(CustomerRepository customerRepository,
                                    PasswordEncoder encoder) {

        this.customerRepository = customerRepository;

        users.put("C001", encoder.encode("john123"));
        users.put("C002", encoder.encode("alex123"));
        users.put("C003", encoder.encode("priya123"));
        users.put("C004", encoder.encode("rahul123"));
        users.put("C005", encoder.encode("sneha123"));
        users.put("C006", encoder.encode("arjun123"));
        users.put("C007", encoder.encode("meera123"));
        users.put("C008", encoder.encode("vikram123"));
        users.put("C009", encoder.encode("anita123"));
        users.put("C010", encoder.encode("karan123"));
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        Customer customer = customerRepository
                .findByCustomerId(username)
                .orElseThrow(() -> new UsernameNotFoundException("Customer not found"));

        String password = users.get(username);

        if(password == null){
            throw new UsernameNotFoundException("Password not configured");
        }

        return new CustomUserDetails(customer, password);
    }
}