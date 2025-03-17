import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:frontend/widgets/ResponseHelper.dart';

import 'APIConfig.dart';

class SignupService{
  // Future<bool> signupUser(String name, String password, String email, File? imageFile, BuildContext context) async {
  //   print("masuk 1 signup");
  //   var postImage = null;
  //   print("image file: $imageFile");
  //   if(imageFile != null){
  //     postImage = await Apiconfig.postMultipart("/api/upload-image", fields: {}, file: imageFile);
  //   }
  //   ResponseHelper responseImage = ResponseHelper.decodeJson(postImage);
  //   String imageUrl = "";
  //   if(responseImage.getErrorCode() == "S001"){
  //     Map<String, dynamic> outputSchema = responseImage.getOutputSchema();
  //     imageUrl = outputSchema["image"];
  //   }
  //   final response = await Apiconfig.post(
  //                   '/user/sign-up',
  //                   body:{'name':name, 'password':password, 'email': email, 'image': imageUrl});
  //   print("response signup service: $response");
  //   ResponseHelper responseHelper = ResponseHelper.decodeJson(response);
  //   String errorCode = responseHelper.getErrorCode();

  //   if(errorCode == "S001"){
  //     Navigator.pushNamed(context, '/login');
  //     return true;
  //   }
  //   return false;
  // }



  Future<bool> signupUser(String name, String password, String email, Uint8List? imageBytes, BuildContext context) async {
    String? base64Image;
    if (imageBytes != null) {
      base64Image = base64Encode(imageBytes);
    }
    
    final response = await Apiconfig.post("/api/upload-image",body : {
      "image": base64Image, // Base64 String
    });

    ResponseHelper responseHelper = ResponseHelper.decodeJson(response);
    String errorCode = responseHelper.getErrorCode();

    String imageUrl = "";
    if (errorCode == "S001") {
      print("Upload Success");
      Map<String, dynamic> outputSchema = responseHelper.getOutputSchema();
      imageUrl = outputSchema["imageUrl"];
    } else {
      print("Upload Failed");
      return false;
    }
    final response2 = await Apiconfig.post(
                    '/user/sign-up',
                    body:{'name':name, 'password':password, 'email': email, 'imageUrl': imageUrl});
    print("response signup service: $response");
    ResponseHelper responseHelper2 = ResponseHelper.decodeJson(response2);
    String errorCode2 = responseHelper2.getErrorCode();

    if(errorCode2 == "S001"){
      Navigator.pushNamed(context, '/login');
      return true;
    }
    return false;
    
  }


}