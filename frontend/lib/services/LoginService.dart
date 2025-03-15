import 'package:frontend/services/APIConfig.dart';
import 'package:frontend/session/SessionManager.dart';
import 'package:frontend/widgets/ResponseHelper.dart';
import 'package:http/http.dart' as http;


class Loginservice {
  Future<String?> loginUser(String name, String password) async {
    print("masuk 1");
    final response = await Apiconfig.post(
                    '/auth/login',
                    body:{'name':name, 'password':password});
    print("response login service: $response");
    // final response = await http.post(Uri.parse('http://192.168.68.123:8080/auth/login'), body:{'name': name, 'password':password});
    ResponseHelper responseHelper = ResponseHelper.decodeJson(response);
    String errorCode = responseHelper.getErrorCode();

    if(errorCode == "S001"){
      Map<String, dynamic> outputSchema = responseHelper.getOutputSchema();
      String sessionId = outputSchema["session-id"];
      SessionManager.saveSession(sessionId);
      return sessionId;
    }
    return null;
  }
}