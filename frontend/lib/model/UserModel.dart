class User {
  final String username;
  final String role;
  final String profileImageUrl;

  User({
    required this.username,
    required this.role,
    required this.profileImageUrl,
  });

  // Convert JSON to User object
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      username: json['username'],
      role: json['role'],
      profileImageUrl: json['image'],
    );
  }

  // Convert User object to JSON (for sending data to backend)
  Map<String, dynamic> toJson() {
    return {
      'username': username,
      'role': role,
      'image': profileImageUrl
    };
  }
}
