import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:frontend/services/LoginService.dart';
import 'package:frontend/widgets/CustomButton.dart';
import 'package:frontend/widgets/CustomTextField.dart';
import 'package:frontend/widgets/GoogleLoginButton.dart';
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

    String? sessionId = await loginservice.loginUser(username, password, context);
    
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
    double screenHeight = MediaQuery.of(context).size.height;
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            SizedBox(
              height: screenHeight * 0.25, // 25% of screen height
              width: double.infinity, // Full width
              child: Image.asset(
                'assets/top_image_login.jpg', // Change to your image path
                fit: BoxFit.cover, // Cover the space
              ),
            ),
            SizedBox(height: 50),
            Text(
              'Welcome Back',
              style: TextStyle(
                color: Color(0xFF7142B0),
                fontWeight: FontWeight.bold,
                fontSize: 50,
                fontFamily: 'BalooChettan'
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
              GestureDetector(
                onTap: () {
                  print("Forgot Password Clicked!"); // Replace with navigation logic
                  Navigator.pushNamed(context, "/forgot-password");
                },
                child: Text(
                  "Forgot Password?",
                  style: TextStyle(
                    color: Color(0xFF7142B0), // Make it look like a link
                    fontWeight: FontWeight.bold,
                    decoration: TextDecoration.underline, // Add underline
                  ),
                ),
              ),

              const SizedBox(height: 10,),
              Text("or"),

              const SizedBox(height: 10,),
              GoogleLoginButton(
                onPressed: (){
                  print("google login");
                }),

              const SizedBox(height: 25,),
              CustomButton(
                onTap: LoginUser,
                nameButton: "Login",
              ),

              const SizedBox(height: 10,),
              Text.rich(
                TextSpan(
                  text: "Don't Have an Account? ", // Normal black text
                  style: TextStyle(color: Colors.black, fontSize: 16),
                  children: [
                    TextSpan(
                      text: "Sign up", // Purple clickable text
                      style: TextStyle(
                        color: Color(0xFF7142B0), // Your custom purple color
                        fontWeight: FontWeight.bold,
                      ),
                      recognizer: TapGestureRecognizer()
                        ..onTap = () {
                          Navigator.pushNamed(context, "/register");
                        },
                    ),
                  ],
                ),
              ),
          ],
        ),
        )
    );
  }
}