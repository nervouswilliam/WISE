import 'package:flutter/material.dart';
import 'package:frontend/screens/loginPage.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

Future<void> main() async {
  // WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: LoginPage(),
    );
  }
}
