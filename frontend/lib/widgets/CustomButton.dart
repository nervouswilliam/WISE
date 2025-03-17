import 'package:flutter/material.dart';

class CustomButton extends StatefulWidget{
  final Function()? onTap;
  final String nameButton;
  const CustomButton({
    super.key,
    required this.onTap,
    required this.nameButton
    });

  @override
  _CustomButtonState createState() => _CustomButtonState();
}

class _CustomButtonState extends State<CustomButton> {
  @override
  Widget build(BuildContext context){
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 25),
      child: Material(
        color: const Color(0xFF7142B0), // Background color
        borderRadius: BorderRadius.circular(12),
        child: InkWell(
          onTap: widget.onTap,
          borderRadius: BorderRadius.circular(12),
          splashColor: Colors.purple[900], // Ripple color
          highlightColor: Colors.purple[700], // Pressed effect
          child: Container(
            padding: const EdgeInsets.all(25),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
            ),
            child: Center(
              child: Text(
                widget.nameButton,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 21,
                  fontFamily: 'Baloo Chettan',
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}