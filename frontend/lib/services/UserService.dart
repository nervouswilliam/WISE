import 'package:flutter/material.dart';
import 'package:frontend/model/UserModel.dart';
import 'package:frontend/services/APIConfig.dart';
import 'package:frontend/session/SessionManager.dart';
import 'package:frontend/widgets/ResponseHelper.dart';

class UserService {
  static Future<User> fetchUserData(BuildContext context) async {
    try {
      String? sessionId = await SessionManager.getSession();
      final response = await Apiconfig.get(
        '/auth/who-am-i',
        headers: {
          "Authorization":"$sessionId"
        }
      );

      ResponseHelper responseHelper = ResponseHelper.decodeJson(response);
      String errorCode = responseHelper.getErrorCode();

      if(errorCode == "S001"){
        Map<String, dynamic> outputSchema = responseHelper.getOutputSchema();
        return User.fromJson(outputSchema);
      } else if(errorCode == "E006"){
        Navigator.pushNamed(context, '/login');
        return User(username: "", role: "", profileImageUrl: "");
      }else {
        return User(username: "", role: "", profileImageUrl: "");
      }
    } catch (e) {
      print("Error fetching user data: $e");
      return User(role: "", username: "", profileImageUrl:"");
    }
  }

  static Future<bool> checkUserExist(String name) async {
    try {
      String? sessionId = await SessionManager.getSession();
      final response = await Apiconfig.get(
        '/user/check-exist?username=$name',
        headers: {
          "Authorization":"$sessionId"
        }
      );

      ResponseHelper responseHelper = ResponseHelper.decodeJson(response);
      String errorCode = responseHelper.getErrorCode();

      if(errorCode == "S001"){
        Map<String, dynamic> outputSchema = responseHelper.getOutputSchema();
        bool userExist = outputSchema["exist"];
        return userExist;
      } else if(errorCode == "E006"){
        print("Unauthorized");
        return false;
      }else {
        print("Internal Server Error");
        return false;
      }
    } catch (e) {
      print("Error fetching user data: $e");
      return false;
    }
  }
}
