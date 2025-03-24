package com.wms.backend.features.products;

import com.google.api.Http;
import com.wms.backend.features.transactions.TransactionModel;
import com.wms.backend.general.CommonUtils;
import com.wms.backend.response.ResponseHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("products")
public class ProductController {
    @Autowired
    private ProductServiceImpl productService;

    @GetMapping(value = "list", produces = "application/json")
    public ResponseEntity<Object> getProductList(@RequestParam(required = false) String search) {
        try{
            return productService.getProduct();
        } catch (Exception e){
            CommonUtils.printErrorLog("CONTROLLER", this.getClass(), e);
            return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "information/{id}", produces = "application/json")
    public ResponseEntity<Object> getProductDetail(@PathVariable String id) {
        try{
            return productService.getProductDetail(id);
        } catch (Exception e){
            CommonUtils.printErrorLog("CONTROLLER", this.getClass(), e);
            return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "information", produces = "application/json")
    public ResponseEntity<Object> insertProduct(@RequestBody TransactionModel model){
        try{
            return productService.insertProduct(model);
        } catch (Exception e){
            CommonUtils.printErrorLog("CONTROLLER", this.getClass(), e);
            return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "stock", produces = "application/json")
    public ResponseEntity<Object> updateProductStock(@RequestBody ProductModel model){
        try{
            return productService.updateProductStock(model);
        } catch (Exception e){
            CommonUtils.printErrorLog("CONTROLLER", this.getClass(), e);
            return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
