import 'package:flutter/material.dart';

class CustomButton extends StatefulWidget{
  final Function()? onTap;
  const CustomButton({
    super.key,
    required this.onTap
    });

  _CustomButtonState createState() => _CustomButtonState();
}

class _CustomButtonState extends State<CustomButton> {
  @override
  Widget build(BuildContext context){
    return GestureDetector(
      onTap: widget.onTap,
      child: Container(
        padding: const EdgeInsets.all(25),
        margin: const EdgeInsets.symmetric(horizontal: 25),
        decoration: BoxDecoration(
          color: Color(0xFF7142B0),
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Center(
          child: Text(
            "Login",
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 21,
              fontFamily: 'Baloo Chettan'
            )
          ),
        )
      ),
    );
  }
}