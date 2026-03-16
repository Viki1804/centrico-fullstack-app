package com.transaction.accountsystem.service.strategy;

import org.springframework.stereotype.Component;

@Component
public class TransactionStrategyFactory {

    private final DepositStrategy depositStrategy;
    private final WithdrawStrategy withdrawStrategy;
    private final TransferStrategy transferStrategy;

    public TransactionStrategyFactory(DepositStrategy depositStrategy,
                                      WithdrawStrategy withdrawStrategy,
                                      TransferStrategy transferStrategy) {
        this.depositStrategy = depositStrategy;
        this.withdrawStrategy = withdrawStrategy;
        this.transferStrategy = transferStrategy;
    }

    public TransactionStrategy getStrategy(String type){

        switch(type){

            case "DEPOSIT":
                return depositStrategy;

            case "WITHDRAW":
                return withdrawStrategy;

            case "TRANSFER":
                return transferStrategy;

            default:
                throw new RuntimeException("Invalid transaction type");
        }
    }
}