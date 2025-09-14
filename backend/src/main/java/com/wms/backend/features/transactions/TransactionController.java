package com.wms.backend.features.transactions;

import com.wms.backend.general.CommonUtils;
import com.wms.backend.response.ResponseHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("transaction")
public class TransactionController {
    @Autowired
    private TransactionServiceImpl transactionService;

    @GetMapping(value = "list", produces = "application/json")
    public ResponseEntity<Object> getTransactionList(@RequestParam String period) {
        try{
            return transactionService.getTransactionList(period);
        } catch (Exception e){
            CommonUtils.printErrorLog("CONTROLLER", this.getClass(), e);
            return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "information", produces = "application/json")
    public ResponseEntity<Object> insertTransaction(@RequestBody TransactionModel model) {
        try{
            System.out.println(model.getTransactionTypeId());
            return transactionService.insertTransaction(model);
        } catch (Exception e){
            CommonUtils.printErrorLog("CONTROLLER", this.getClass(), e);
            return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
