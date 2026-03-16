package com.transaction.accountsystem.service.strategy;

import com.transaction.accountsystem.dto.TransactionRequestDTO;
import com.transaction.accountsystem.dto.TransferRequestDTO;

public interface TransactionStrategy {

    String process(TransactionRequestDTO request);

    default String processTransfer(TransferRequestDTO request) {
        throw new UnsupportedOperationException("Deposit and Withdraw strategies do not support transfer operations");
    }
}