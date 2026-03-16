package com.transaction.accountsystem.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "ACCOUNT")
public class Account {

    @Id
    @Column(name = "A_ID")
    private Long accountId;

    @Column(name = "BALANCE")
    private Double balance;

    @Column(name = "STATUS")
    private String status;

    @ManyToOne
    @JoinColumn(name = "C_ID")
    private Customer customer;

    @JsonIgnore
    @OneToMany(mappedBy = "account")
    private List<Transaction> transactions;

    public Account() {}


    public Account(Long accountId, Double balance, String status, Customer customer) {
        this.accountId = accountId;
        this.balance = balance;
        this.status = status;
        this.customer = customer;
    }


    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }
    
}