import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:frontend/screens/HomePage.dart';
import 'package:flutter_web_plugins/flutter_web_plugins.dart';
import 'package:frontend/screens/SignupPage.dart';
import 'package:frontend/screens/loginPage.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load();
  if (kIsWeb) {
    usePathUrlStrategy(); // ✅ Only run this on Web
  }
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: '/login',  // Default route
      routes: {
        '/home': (context) => HomePage(),
        '/login': (context) => LoginPage(),
        '/register': (context) => SignupPage(),
      },
    );
  }
}
