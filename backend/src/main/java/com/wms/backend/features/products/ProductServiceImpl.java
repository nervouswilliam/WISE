package com.wms.backend.features.products;

import com.wms.backend.general.CommonUtils;
import com.wms.backend.response.ResponseHelper;
import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ProductServiceImpl {
    @Autowired
    private ProductDaoImpl productDao;

    public ResponseEntity<Object> getProductList() {
        List<Map<String, Object>> productList;
        try{
            productList = productDao.getProductList();
            if(productList.isEmpty()){
                return ResponseHelper.generateResponse("E005", null, HttpStatus.UNPROCESSABLE_ENTITY);
            }
            return ResponseHelper.generateResponse("S001", productList, HttpStatus.OK);
        } catch (Exception e){
            CommonUtils.printErrorLog("SERVICE", this.getClass(), e);
            return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<Object> insertProduct(ProductModel model) {
        try{
            productDao.insertProduct(model);
            if(!productDao.checkCategoriesExist(model.getCategory())){
                productDao.insertCategory(model);
            }
            int productId = productDao.getCategoriesId(model.getCategory());
            productDao.insertProductCategories(model, productId);
            return ResponseHelper.generateResponse("S001", null, HttpStatus.OK);
        } catch (Exception e){
            CommonUtils.printErrorLog("SERVICE", this.getClass(), e);
            return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
