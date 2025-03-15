import 'package:flutter/material.dart';
import 'package:frontend/services/LoginService.dart';
import 'package:frontend/widgets/CustomButton.dart';
import 'package:frontend/widgets/CustomTextField.dart';
import 'package:frontend/widgets/NotificationHelper.dart';

class LoginPage extends StatefulWidget{
  const LoginPage({super.key});

  
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  // Text editing controllers
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();

  final Loginservice loginservice = Loginservice();
  void LoginUser() async {
    String username = usernameController.text.trim();
    String password = passwordController.text.trim();

    if (username.isEmpty || password.isEmpty) {
      // Handle empty fields
      NotificationHelper.showError(context, "Please enter username and password !");
      return;
    }

    String? sessionId = await loginservice.loginUser(username, password);
    
    if (sessionId != null) {
      NotificationHelper.showSuccess(context);
      // Navigate to home page or dashboard here
    } else {
      NotificationHelper.showError(context, "Invalid Credentials");
      // Show error message
    }
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            SizedBox(height: 50),
            Text(
              'Login',
              style: TextStyle(
                color: Color(0xFF7142B0),
                fontWeight: FontWeight.bold,
                fontSize: 50,
                fontFamily: 'Baloo Chettan'
              ),),

              SizedBox(height : 25),
              CustomTextField(
                controller: usernameController,
                hintText: 'username',
                obscureText: false,
              ),

              SizedBox(height: 25,),
              CustomTextField(
                controller: passwordController,
                hintText: 'password',
                obscureText: true,
              ),

              const SizedBox(height: 10,),
              Text("Forgot Password"),


              const SizedBox(height: 25,),
              CustomButton(
                onTap: LoginUser,
              ),
          ],
        ),
        )
    );
  }
}