import 'package:flutter/material.dart';
import 'package:frontend/model/UserModel.dart';
import 'package:frontend/services/UserService.dart';
import 'package:frontend/widgets/CustomAppBar.dart';
import 'package:frontend/widgets/CustomSidebar.dart';

class HomePage extends StatefulWidget{
  const HomePage({super.key});

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  User? user;
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      loadUserData(context);
    });
  }

  void loadUserData(BuildContext context) async {
    try {
      User fetchedUser = await UserService.fetchUserData(context);
      setState(() {
        user = fetchedUser;
      });
    } catch (e) {
      print("Error: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: user != null 
          ? CustomAppBar(
              username: user!.username, 
              role: user!.role,
              profileImageUrl: user!.profileImageUrl,
              onNotificationPressed: () {
                print("Notification Clicked");
              },
              onLogoutPressed: () {
                print("Logout Clicked");
              },
            )
          : PreferredSize(
              preferredSize: const Size.fromHeight(kToolbarHeight),
              child: AppBar(title: Text("Loading...")),
            ),
      drawer: const CustomSidebar(),
      body: const Center(child: Text('Welcome to Home Page')),
    );
  }
  
}