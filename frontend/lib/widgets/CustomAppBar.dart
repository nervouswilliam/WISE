import 'package:flutter/material.dart';
import 'package:frontend/session/SessionManager.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String username;
  final String role;
  final String profileImageUrl;
  final VoidCallback onNotificationPressed;

  const CustomAppBar({
    super.key,
    required this.username,
    required this.role,
    required this.profileImageUrl,
    required this.onNotificationPressed,
  });

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: const Color(0xFF7142B0),
      elevation: 0,
      centerTitle: false,
      title: const Text(
        'WISELY',
        style: TextStyle(
          fontFamily: 'BalooChettan',
          fontSize: 30,
          fontWeight: FontWeight.w900,
          color: Colors.white,
        ),
      ),
      actions: [
        Row(
          children: [
            CircleAvatar(
              backgroundImage: NetworkImage(profileImageUrl),
              radius: 20,
            ),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  username,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                Text(
                  role,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Colors.white70,
                  ),
                ),
              ],
            ),
            IconButton(
              icon: const Icon(Icons.notifications, color: Colors.white),
              onPressed: onNotificationPressed,
            ),
            IconButton(
              icon: const Icon(Icons.logout, color: Colors.white),
              onPressed: () => _logout(context),
            ),
          ],
        ),
      ],
    );
  }

  Future<void> _logout(BuildContext context) async {
    try {
      await SessionManager.clearSession();

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Logged out successfully")),
      );

      // 🔹 Navigate back to login and remove all previous routes
      if (context.mounted) {
        Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
      }
    } catch (e) {
      print("❌ Logout failed: $e");
    }
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
