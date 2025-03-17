import 'package:flutter/material.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String username;
  final String role;
  final String profileImageUrl;
  final VoidCallback onNotificationPressed;
  final VoidCallback onLogoutPressed;

  const CustomAppBar({
    super.key,
    required this.username,
    required this.role,
    required this.profileImageUrl,
    required this.onNotificationPressed,
    required this.onLogoutPressed,
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
              onPressed: onLogoutPressed,
            ),
          ],
        ),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
