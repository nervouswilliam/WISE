import 'dart:io';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:frontend/services/LoginService.dart';
import 'package:frontend/services/SignupService.dart';
import 'package:frontend/services/UserService.dart';
import 'package:frontend/widgets/CustomButton.dart';
import 'package:frontend/widgets/CustomImageInput.dart';
import 'package:frontend/widgets/CustomTextField.dart';
import 'package:frontend/widgets/NotificationHelper.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:typed_data';

class SignupPage extends StatefulWidget{
  const SignupPage({super.key});

  
  @override
  _SignupPageState createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  // Text editing controllers
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();
  final emailController = TextEditingController();

  final SignupService signupService = SignupService();
  final UserService userService = UserService();
  // File? _image;
  Uint8List? _imageBytes;
  String? _imageFilename;
  void SignupUser() async {
    String username = usernameController.text.trim();
    String password = passwordController.text.trim();
    String confirmPassword = confirmPasswordController.text.trim();
    String email = emailController.text.trim();

    if (username.isEmpty || password.isEmpty || email.isEmpty) {
      // Handle empty fields
      NotificationHelper.showError(context, "username, password, and email must be filled !");
      return;
    }

    if(await UserService.checkUserExist(username)){
      NotificationHelper.showError(context, "Username is taken");
      return;
    }

    if (password != confirmPassword){
      NotificationHelper.showError(context, "password must match !");
    }

    bool status = await signupService.signupUser(username, password, email, _imageBytes, context);
    
    if (status) {
      NotificationHelper.showSuccess(context);
      // Navigate to home page or dashboard here
    } else {
      NotificationHelper.showError(context, "Invalid user info");
      // Show error message
    }
  }

  // Future<void> _pickImage() async {
  //   final pickedFile = await ImagePicker().pickImage(source: ImageSource.gallery);

  //   if (pickedFile != null) {
  //     setState(() {
  //       _image = File(pickedFile.path);
  //     });
  //   }
  // }

  @override
  Widget build(BuildContext context) {
    double screenHeight = MediaQuery.of(context).size.height;
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
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
                'Sign Up',
                style: TextStyle(
                  color: Color(0xFF7142B0),
                  fontWeight: FontWeight.bold,
                  fontSize: 50,
                  fontFamily: 'BalooChettan'
                ),),

                SizedBox(height: 25),

                // CustomImageInput(
                //   imageBytes: _imageBytes,
                //   onImagePicked: (Uint8List? pickedBytes) {
                //     setState(() {
                //       _imageBytes = pickedBytes;
                //     });
                //   },
                // ),

                CustomImageInput(
                  imageBytes: _imageBytes,
                  onImagePicked: (Uint8List? pickedBytes, String? pickedFilename) {
                    setState(() {
                      _imageBytes = pickedBytes;
                      _imageFilename = pickedFilename;
                    });
                  },
                ),

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

                SizedBox(height: 25,),
                CustomTextField(
                  controller: confirmPasswordController,
                  hintText: 'confirm password',
                  obscureText: true,
                ),

                SizedBox(height: 25,),
                CustomTextField(
                  controller: emailController,
                  hintText: 'email',
                  obscureText: false,
                ),


                const SizedBox(height: 25,),
                CustomButton(
                  onTap: SignupUser,
                  nameButton: "Sign Up",
                ),

                const SizedBox(height: 50),
            ],
          ),
        )
        )
    );
  }
}