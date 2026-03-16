package com.transaction.accountsystem.security;

import com.transaction.accountsystem.entity.Customer;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.*;

public class CustomUserDetails implements UserDetails {

    private final Customer customer;
    private final String password;

    public CustomUserDetails(Customer customer, String password) {
        this.customer = customer;
        this.password = password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return customer.getCustomerId();
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}