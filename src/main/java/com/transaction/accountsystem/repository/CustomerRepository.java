package com.transaction.accountsystem.repository;

import com.transaction.accountsystem.entity.Customer;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {

    Optional<Customer> findByCustomerId(String customerId);
    

}