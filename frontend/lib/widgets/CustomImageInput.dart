// import 'dart:io';
// import 'package:flutter/material.dart';
// import 'package:image_picker/image_picker.dart';

// class CustomImageInput extends StatefulWidget {
//   final File? imageFile;
//   final Function(File?) onImagePicked;

//   const CustomImageInput({
//     super.key,
//     required this.imageFile,
//     required this.onImagePicked,
//   });

//   Future<void> _pickImage() async {
//     final pickedFile = await ImagePicker().pickImage(source: ImageSource.gallery);

//     if (pickedFile != null) {
//       onImagePicked(File(pickedFile.path));
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return GestureDetector(
//       onTap: _pickImage,
//       child: Container(
//         width: 110, // Slightly larger to fit border
//         height: 110,
//         decoration: BoxDecoration(
//           shape: BoxShape.circle,
//           border: Border.all(
//             color: Colors.purple, // Border color
//             width: 4, // Border thickness
//           ),
//         ),
//         child: CircleAvatar(
//           radius: 50,
//           backgroundColor: Colors.grey[300],
//           backgroundImage: imageFile != null ? FileImage(imageFile!) : null,
//           child: imageFile == null
//               ? const Icon(Icons.camera_alt, size: 40, color: Colors.grey)
//               : null,
//         ),
//       ),
//     );
//   }
// }


// import 'dart:typed_data';
// import 'package:flutter/material.dart';
// import 'package:image_picker/image_picker.dart';

// class CustomImageInput extends StatelessWidget {
//   final Uint8List? imageBytes;
//   final Function(Uint8List?) onImagePicked;

//   const CustomImageInput({
//     super.key,
//     required this.imageBytes,
//     required this.onImagePicked,
//   });

//   Future<void> _pickImage() async {
//     final pickedFile = await ImagePicker().pickImage(source: ImageSource.gallery);

//     if (pickedFile != null) {
//       final bytes = await pickedFile.readAsBytes(); // Convert to Uint8List
//       onImagePicked(bytes); // Pass Uint8List
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return GestureDetector(
//       onTap: _pickImage,
//       child: Container(
//         width: 110, 
//         height: 110,
//         decoration: BoxDecoration(
//           shape: BoxShape.circle,
//           border: Border.all(color: Colors.purple, width: 4),
//         ),
//         child: CircleAvatar(
//           radius: 50,
//           backgroundColor: Colors.grey[300],
//           backgroundImage: imageBytes != null ? MemoryImage(imageBytes!) : null, // ✅ Use MemoryImage for Uint8List
//           child: imageBytes == null
//               ? const Icon(Icons.camera_alt, size: 40, color: Colors.grey)
//               : null,
//         ),
//       ),
//     );
//   }
// }


import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class CustomImageInput extends StatelessWidget {
  final Uint8List? imageBytes;
  final void Function(Uint8List?, String?) onImagePicked;

  const CustomImageInput({super.key, required this.imageBytes, required this.onImagePicked});

  Future<void> _pickImage() async {
    final pickedFile = await ImagePicker().pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      Uint8List bytes = await pickedFile.readAsBytes();
      String filename = pickedFile.name;
      onImagePicked(bytes, filename);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (imageBytes != null)
          Image.memory(imageBytes!, height: 100, width: 100, fit: BoxFit.cover),
        ElevatedButton(
          onPressed: _pickImage,
          child: const Text("Pick Image"),
        ),
      ],
    );
  }
}


