package com.wms.backend.features.products;

import com.wms.backend.features.transactions.TransactionDaoImpl;
import com.wms.backend.features.transactions.TransactionModel;
import com.wms.backend.general.CommonUtils;
import com.wms.backend.response.ResponseHelper;
import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ProductServiceImpl {
    @Autowired
    private ProductDaoImpl productDao;
    @Autowired
    private TransactionDaoImpl transactionDao;

    public ResponseEntity<Object> getProductList(String search, int page) {
        List<Map<String, Object>> productList;
        try{
            productList = productDao.getProductList(search, page, 10.0);
            if(productList.isEmpty()){
                return ResponseHelper.generateResponse("E005", null, HttpStatus.UNPROCESSABLE_ENTITY);
            }
            return ResponseHelper.generateResponse("S001", productList, HttpStatus.OK);
        } catch (Exception e){
            CommonUtils.printErrorLog("SERVICE", this.getClass(), e);
            return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<Object> getProduct() {
        List<Map<String, Object>> productList;
        try{
            productList = productDao.getProduct();
            if(productList.isEmpty()){
                return ResponseHelper.generateResponse("E005", null, HttpStatus.UNPROCESSABLE_ENTITY);
            }
            return ResponseHelper.generateResponse("S001", productList, HttpStatus.OK);
        } catch (Exception e){
            CommonUtils.printErrorLog("SERVICE", this.getClass(), e);
            return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional // rollback if there is error
    public ResponseEntity<Object> insertProduct(TransactionModel model) {
        try{
            productDao.insertProduct(model);
            if(!productDao.checkCategoriesExist(model.getCategory())){
                productDao.insertCategory(model);
            }
            int productId = productDao.getCategoriesId(model.getCategory());
            productDao.insertProductCategories(model, productId);
            productDao.refreshViewProductsTable();
            transactionDao.insertProductTransaction(model);
            transactionDao.refreshViewTransactionTable();
            return ResponseHelper.generateResponse("S001", null, HttpStatus.OK);
        } catch (Exception e){
            CommonUtils.printErrorLog("SERVICE", this.getClass(), e);
            return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public ResponseEntity<Object> updateProductStock(ProductModel model) {
        try{
            productDao.updateProduct(model);
            return ResponseHelper.generateResponse("S001", null, HttpStatus.OK);
        } catch (Exception e){
            CommonUtils.printErrorLog("SERVICE", this.getClass(), e);
            return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
