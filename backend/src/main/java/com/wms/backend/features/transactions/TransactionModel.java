package com.wms.backend.features.transactions;

import lombok.Data;

@Data
public class TransactionModel {
    public String id;
    public String transaction_type;
    public int totalPrice;
    public int quantity;
}
