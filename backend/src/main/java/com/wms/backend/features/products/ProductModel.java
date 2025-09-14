package com.wms.backend.features.products;

import lombok.Data;

@Data
public class ProductModel {
    public String id;
    public String name;
    public int price;
    public int stock;
    public String category;
    public String image_url;
    public String public_id;
}
