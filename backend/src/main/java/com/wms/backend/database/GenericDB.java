package com.wms.backend.database;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;
import java.util.StringJoiner;

@Repository
public class GenericDB {
    private final JdbcTemplate jdbcTemplate;
    private final Logger logger = LogManager.getLogger();

    public GenericDB(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void insert(String table, HashMap<String, Object> data){
        StringJoiner columns = new StringJoiner(", ");
        StringJoiner placeholders = new StringJoiner(", ");
        Object[] values = new Object[data.size()];

        int index = 0;
        for (Map.Entry<String, Object> entry : data.entrySet()) {
            columns.add(entry.getKey());       // Column names
            placeholders.add("?");             // Placeholders for values
            values[index++] = entry.getValue();
        }

        String sql = String.format("INSERT INTO %s (%s) VALUES (%s)", table, columns, placeholders);
        logger.info("SQL INSERT: {}",sql);
        jdbcTemplate.update(sql, values);
    }

    public void update(String table, HashMap<String, Object> data, String whereClause, Object... whereParams){
        StringJoiner updates = new StringJoiner(", ");
        Object[] values = new Object[data.size() + whereParams.length];

        int index = 0;
        for (Map.Entry<String, Object> entry : data.entrySet()) {
            updates.add(entry.getKey() + " = ?");
            values[index++] = entry.getValue();
        }

        System.arraycopy(whereParams, 0, values, index, whereParams.length);
        String sql = String.format("UPDATE %s SET %s WHERE %s", table, updates, whereClause);
        logger.info("SQL UPDATE: {}",sql);
        jdbcTemplate.update(sql, values);
    }

    public void delete(String table, String whereClause, Object... whereParams){
        String sql = String.format("DELETE FROM %s WHERE %s", table, whereClause);
        logger.info("SQL DELETE: {}", sql);
        jdbcTemplate.update(sql, whereParams);
    }
}
