import 'package:another_flushbar/flushbar.dart';
import 'package:flutter/material.dart';

class NotificationHelper {
  static void showSuccess(BuildContext context) {
    Flushbar(
      message: "Success!",
      duration: Duration(seconds: 2),
      backgroundColor: Colors.green,
      margin: EdgeInsets.all(8),
      borderRadius: BorderRadius.circular(8),
      flushbarPosition: FlushbarPosition.TOP, // Show at the top
    ).show(context);
  }

  static void showError(BuildContext context, String reason) {
    Flushbar(
      message: "Failed: $reason",
      duration: Duration(seconds: 3),
      backgroundColor: Colors.red,
      margin: EdgeInsets.all(8),
      borderRadius: BorderRadius.circular(8),
      flushbarPosition: FlushbarPosition.TOP, // Show at the top
    ).show(context);
  }
}
