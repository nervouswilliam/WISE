import 'package:flutter/foundation.dart'; // Import for kIsWeb
import 'package:shared_preferences/shared_preferences.dart';
import 'package:web/web.dart' as web; // New import for Web Storage

class SessionManager {
  /// Save session ID
  static Future<void> saveSession(String sessionId) async {
    if (kIsWeb) {
      web.window.sessionStorage.setItem('sessionId',sessionId); // Web Storage
    } else {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('sessionId', sessionId); // Mobile & Desktop Storage
    }
  }

  /// Retrieve session ID
  static Future<String?> getSession() async {
    if (kIsWeb) {
      return web.window.sessionStorage.getItem('sessionId'); // Web Storage
    } else {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString('sessionId'); // Mobile & Desktop Storage
    }
  }

  /// Delete session ID
  static Future<void> clearSession() async {
    if (kIsWeb) {
      web.window.sessionStorage.removeItem('sessionId'); // Web Storage
    } else {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('sessionId'); // Mobile & Desktop Storage
    }
  }
}
