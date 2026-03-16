package com.transaction.accountsystem.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class TransactionLoggingAspect {

    private static final Logger logger =
            LoggerFactory.getLogger(TransactionLoggingAspect.class);

    @Before("execution(* com.transaction.accountsystem.service..*(..))")
    public void logBefore(JoinPoint joinPoint){

        logger.info("Transaction started: {}", joinPoint.getSignature().getName());

        Object[] args = joinPoint.getArgs();

        for(Object arg : args){
            logger.info("Argument: {}", arg);
        }
    }

    @AfterReturning("execution(* com.transaction.accountsystem.service..*(..))")
    public void logAfter(JoinPoint joinPoint){

        logger.info("Transaction completed: {}", joinPoint.getSignature().getName());
    }
}