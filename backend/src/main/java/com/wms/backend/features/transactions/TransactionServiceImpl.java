package com.wms.backend.features.transactions;

import com.wms.backend.general.CommonUtils;
import com.wms.backend.response.ResponseHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransactionServiceImpl {
    @Autowired
    private TransactionDaoImpl transactionDao;

    @Transactional
    public ResponseEntity<Object> insertTransaction(TransactionModel model) {
        try{
            transactionDao.insertProductTransaction(model);
            transactionDao.refreshViewTransactionTable();
//            transactionDao.insertTransactionType(model);
            return ResponseHelper.generateResponse("S001", null, HttpStatus.OK);
        } catch (Exception e){
            CommonUtils.printErrorLog("SERVICE", this.getClass(), e);
            return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
