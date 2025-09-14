package com.wms.backend.features.transactions;

import com.wms.backend.features.products.ProductModel;
import lombok.Data;

@Data
public class TransactionModel extends ProductModel {
    public String transactionId;
    public int transactionTypeId;
    public int totalPrice;
    public int quantity;
    public int price_per_unit;
    public String reason;
}
