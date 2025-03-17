package com.wms.backend.features.user;

import lombok.Data;

@Data
public class UserModel {
    public int id;
    public String name;
    public String password;
    public String role;
    public String email;
    public String imageUrl;
}
