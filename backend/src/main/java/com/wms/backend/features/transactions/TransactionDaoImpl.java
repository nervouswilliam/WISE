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

    public void insertProductTransaction(TransactionModel model) {
        try{
            HashMap<String, Object> map = new HashMap<>();
            model.setTransaction_Id(String.valueOf(UUID.randomUUID()));
            map.put("id", model.getTransaction_Id());
            map.put("transaction_type_id", model.getTransaction_type_id());
            map.put("product_id", model.getId());
            map.put("price_per_unit", model.getPrice());
            map.put("quantity", model.getStock());
            genericDB.insert("transactions", map);
        } catch (Exception e){
            CommonUtils.printErrorLog("DAO", this.getClass(), e);
        }
    }

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
