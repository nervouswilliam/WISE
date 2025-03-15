import 'package:flutter/material.dart';

class NotificationHelper {
  static void showSuccess(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text("Success!"),
        backgroundColor: Colors.green,
        duration: Duration(seconds: 2),
      ),
    );
  }

  static void showError(BuildContext context, String reason) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text("Failed: $reason"),
        backgroundColor: Colors.red,
        duration: Duration(seconds: 3),
      ),
    );
  }
}
