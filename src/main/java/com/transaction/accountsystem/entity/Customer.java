package com.transaction.accountsystem.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "CUSTOMER")
public class Customer {

    @Id
    @Column(name = "C_ID")
    private String customerId;

    @Column(name = "C_NAME")
    private String name;

    @Column(name = "C_EMAIL")
    private String email;

    @Column(name = "C_ADDRESS")
    private String address;

    @JsonIgnore
    @OneToMany(mappedBy = "customer")
    private List<Account> accounts;

    public Customer() {}
    
    public Customer(String customerId, String name, String email, String address) {
        this.customerId = customerId;
        this.name = name;
        this.email = email;
        this.address = address;
    }


    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
   
}