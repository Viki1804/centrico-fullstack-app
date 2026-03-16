package com.transaction.accountsystem.repository;

import com.transaction.accountsystem.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    Account findByCustomerCustomerId(String customerId);
    

}

// Jparepository already has save()
// findById()
// findAll()
// delete()