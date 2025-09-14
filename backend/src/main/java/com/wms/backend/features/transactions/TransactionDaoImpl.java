package com.wms.backend.features.transactions;

import com.wms.backend.database.GenericDB;
import com.wms.backend.general.CommonUtils;
import com.wms.backend.response.ResponseHelper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public class TransactionDaoImpl {
    @Autowired
    private GenericDB genericDB;
    private final Logger logger = LogManager.getLogger();
    private final JdbcTemplate jdbcTemplate;

    public TransactionDaoImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> getTransactionList(){
        try {
            String sql = "SELECT * FROM view_transaction";
            logger.info("SQL SELECT: {}", sql);
            return jdbcTemplate.queryForList(sql);
        } catch (Exception e){
            CommonUtils.printErrorLog("DAO", this.getClass(), e);
            return null;
        }
    }

    public List<Map<String, Object>> getTransactionListDaily(){
        try {
            String sql = "SELECT * FROM view_transaction WHERE DATE(created_at) = CURRENT_DATE";
            logger.info("SQL SELECT: {}", sql);
            return jdbcTemplate.queryForList(sql);
        } catch (Exception e){
            CommonUtils.printErrorLog("DAO", this.getClass(), e);
            return null;
        }
    }

    public List<Map<String, Object>> getTransactionListWeekly(){
        try {
            String sql = "SELECT * FROM view_transaction WHERE created_at >= (CURRENT_DATE - interval '7 days');";
            logger.info("SQL SELECT: {}", sql);
            return jdbcTemplate.queryForList(sql);
        } catch (Exception e){
            CommonUtils.printErrorLog("DAO", this.getClass(), e);
            return null;
        }
    }

    public List<Map<String, Object>> getTransactionListMonthly(){
        try {
            String sql = "SELECT *\n" +
                    "FROM view_transaction\n" +
                    "WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)\n" +
                    "AND created_at < (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month');";
            logger.info("SQL SELECT: {}", sql);
            return jdbcTemplate.queryForList(sql);
        } catch (Exception e){
            CommonUtils.printErrorLog("DAO", this.getClass(), e);
            return null;
        }
    }

    public List<Map<String, Object>> getTransactionListQuarterly(){
        try {
            String sql = "SELECT *\n" +
                    "FROM view_transaction\n" +
                    "WHERE created_at >= DATE_TRUNC('quarter', CURRENT_DATE)\n" +
                    "AND created_at < (DATE_TRUNC('quarter', CURRENT_DATE) + INTERVAL '3 months');";
            logger.info("SQL SELECT: {}", sql);
            return jdbcTemplate.queryForList(sql);
        } catch (Exception e){
            CommonUtils.printErrorLog("DAO", this.getClass(), e);
            return null;
        }
    }

    public List<Map<String, Object>> getTransactionListYearly(){
        try {
            String sql = "SELECT *\n" +
                    "FROM view_transaction\n" +
                    "WHERE created_at >= DATE_TRUNC('year', CURRENT_DATE)\n" +
                    "AND created_at < (DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year');";
            logger.info("SQL SELECT: {}", sql);
            return jdbcTemplate.queryForList(sql);
        } catch (Exception e){
            CommonUtils.printErrorLog("DAO", this.getClass(), e);
            return null;
        }
    }

    public void insertProductTransaction(TransactionModel model) {
        try{
            HashMap<String, Object> map = new HashMap<>();
            model.setTransactionId(String.valueOf(UUID.randomUUID()));
            map.put("id", model.getTransactionId());
            System.out.println("transaction type: "+model.getTransactionTypeId());
            map.put("transaction_type_id", model.getTransactionTypeId());
            map.put("product_id", model.getId());
            map.put("price_per_unit", model.getPrice());
            map.put("quantity", model.getStock());
            map.put("reason", model.getReason());
            genericDB.insert("transactions", map);
        } catch (Exception e){
            CommonUtils.printErrorLog("DAO", this.getClass(), e);
        }
    }

//    public void insertTransactionType(TransactionModel model) {
//        try{
//            HashMap<String, Object> map = new HashMap<>();
//            map.put("id", model.getTransaction_type_id());
//            genericDB.insert("type_transaction", map);
//        } catch (Exception e){
//            CommonUtils.printErrorLog("DAO", this.getClass(), e);
//        }
//    }

    public void refreshViewTransactionTable(){
        try{
            String sql = "REFRESH MATERIALIZED VIEW view_transaction";
            logger.info("SQL REFRESH: {}", sql);
            jdbcTemplate.update(sql);
        } catch (Exception e){
            CommonUtils.printErrorLog("DAO", this.getClass(), e);
        }
    }
}
