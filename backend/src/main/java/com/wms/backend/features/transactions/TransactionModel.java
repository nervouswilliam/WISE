package com.wms.backend.features.transactions;

import com.wms.backend.features.products.ProductModel;
import lombok.Data;

@Data
public class TransactionModel extends ProductModel {
    public String transaction_Id;
    public int transaction_type_id;
    public int totalPrice;
    public int quantity;
    public int price_per_unit;
}
