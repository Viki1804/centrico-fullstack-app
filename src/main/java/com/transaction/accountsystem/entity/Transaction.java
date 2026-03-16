package com.transaction.accountsystem.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "TRANSACTIONS")
public class Transaction {

    @Id
    @Column(name = "T_ID")
    private Long transactionId;

    @Column(name = "T_TYPE")
    private String type;

    @Column(name = "AMOUNT")
    private Double amount;

    @Column(name = "T_DATE")
    private Date date;

    @ManyToOne
    @JoinColumn(name = "A_ID")
    private Account account;

    public Transaction() {}

    public Transaction(Long transactionId, String type, Double amount, Date date, Account account) {
        this.transactionId = transactionId;
        this.type = type;
        this.amount = amount;
        this.date = date;
        this.account = account;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    
}