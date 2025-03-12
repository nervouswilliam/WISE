package com.wms.backend.general;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class CommonUtils {
    private static final Logger logger = LogManager.getLogger();

    public static void printErrorLog(String layer, Class<?> clazz, Exception e) {
        StackTraceElement element = e.getStackTrace()[0];
        logger.error("ERROR IN: {}", layer);
        logger.error("FILE NAME: {}", clazz.getSimpleName());
        logger.error("METHOD NAME: {}", element.getMethodName());
        logger.error("LINE NUMBER: {}", element.getLineNumber());
        logger.error("ERROR MESSAGE: {}", e.getMessage());
    }
}
