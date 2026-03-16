package com.transaction.accountsystem.dto;

public class TransactionRequestDTO {

    private Long accountId;
    private Double amount;

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    @Override
    public String toString() {
        return "TransactionRequestDTO{" +
                "accountId=" + accountId +
                ", amount=" + amount +
                '}';
    }
}