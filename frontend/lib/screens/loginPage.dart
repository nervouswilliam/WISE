import 'package:flutter/material.dart';
import 'package:frontend/widgets/CustomButton.dart';
import 'package:frontend/widgets/CustomTextField.dart';

class LoginPage extends StatefulWidget{
  LoginPage({super.key});

  
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  // Text editing controllers
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();

  void LoginUser(){}
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