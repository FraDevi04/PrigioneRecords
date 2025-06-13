package com.prigione.aspect;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class LoggingAspect {

    private final ObjectMapper objectMapper;

    @Around("execution(* com.prigione.controller.*.*(..))")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();
        
        // Log request
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        log.info("Request: {} {} - Method: {}.{}", 
            request.getMethod(), 
            request.getRequestURI(),
            className,
            methodName);
        
        try {
            Object result = joinPoint.proceed();
            long executionTime = System.currentTimeMillis() - start;
            
            // Log response
            log.info("Response: {} {} - Method: {}.{} - Time: {}ms", 
                request.getMethod(), 
                request.getRequestURI(),
                className,
                methodName,
                executionTime);
            
            return result;
        } catch (Exception e) {
            log.error("Error in {}.{}: {}", className, methodName, e.getMessage(), e);
            throw e;
        }
    }
} 