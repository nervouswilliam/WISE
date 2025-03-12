package com.wms.backend.features.products;

import com.wms.backend.database.GenericDB;
import com.wms.backend.general.CommonUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class ProductDaoImpl {
    @Autowired
    private GenericDB genericDB;
    private final Logger logger = LogManager.getLogger();
    private final JdbcTemplate jdbcTemplate;

    public ProductDaoImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> getProductList(){
        try{
            String sql = "SELECT * FROM \"products\"";
            logger.info("SQL SELECT: {}", sql);
            return jdbcTemplate.queryForList(sql);
        } catch (Exception e){
            CommonUtils.printErrorLog("DAO", this.getClass(), e);
            return null;
        }
    }

    public void insertProduct(ProductModel model) {
        try{
            HashMap <String, Object> map = new HashMap<>();
            map.put("id", model.getId());
            map.put("name", model.getName());
            map.put("price", model.getPrice());
            map.put("stock", model.getStock());
            map.put("image_url", model.getImage_url());
            genericDB.insert("products", map);
        } catch (Exception e){
            CommonUtils.printErrorLog("DAO", this.getClass(), e);
        }
    }

    public void insertCategory(ProductModel model) {
        try{
            HashMap<String, Object> map = new HashMap<>();
            map.put("name", model.getCategory());
            genericDB.insert("categories", map);
        } catch (Exception e){
            CommonUtils.printErrorLog("DAO", this.getClass(), e);
        }
    }

    public void insertProductCategories(ProductModel model, int categoryId) {
        try{
            HashMap<String, Object> map = new HashMap<>();
            map.put("product_id", model.getId());
            map.put("category_id", categoryId);
            genericDB.insert("categories_product", map);
        } catch (Exception e){
            CommonUtils.printErrorLog("DAO", this.getClass(), e);
        }
    }

    public int getCategoriesId(String name) {
        try{
            String sql = "select id from \"categories\" where name = ?";
            logger.info("SQL SELECT: {}", sql);
            return jdbcTemplate.queryForObject(sql, Integer.class, name);
        } catch (Exception e){
            CommonUtils.printErrorLog("DAO", this.getClass(), e);
        }
        return 0;
    }

    public boolean checkCategoriesExist(String name) {
        try{
            String sql = "select exists (select * from \"categories\" where name = ? LIMIT 1)";
            logger.info("SQL SELECT: {}", sql);
            return Boolean.TRUE.equals(jdbcTemplate.queryForObject(sql, boolean.class, name));
        } catch (Exception e){
            CommonUtils.printErrorLog("DAO", this.getClass(), e);
            return false;
        }
    }
}
