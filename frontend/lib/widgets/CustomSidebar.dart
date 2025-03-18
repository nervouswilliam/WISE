import 'package:flutter/material.dart';

class CustomSidebar extends StatelessWidget {
  const CustomSidebar({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          Container(
            height: 55,
            color: Color(0xFF7142B0),
            alignment: Alignment.center,
            child: Text(
              'WISELY',
              style: TextStyle(color: Colors.white, fontSize: 40, fontFamily: 'BalooChettan', fontWeight: FontWeight.bold),
            ),
          ),

          ListTile(
            title: Text(
              "Jelajah",
              style: TextStyle(
                color: Colors.grey,
                fontFamily: 'BalooChettan',
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.dashboard),
            title: const Text('Dashboard'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/dashboard');
            },
          ),

          ListTile(
            title: Text(
              "Inventory",
              style: TextStyle(
                color: Colors.grey,
                fontFamily: 'BalooChettan',
                fontWeight: FontWeight.bold,
              ),
            ),
          ),

          ListTile(
            leading: const Icon(Icons.inventory_2),
            title: const Text('Produk'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/produk');
            },
          ),

          ListTile(
            leading: const Icon(Icons.conveyor_belt),
            title: const Text('Supplier'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/supplier');
            },
          ),

          ListTile(
            leading: const Icon(Icons.receipt),
            title: const Text('Report'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/report');
            },
          ),

          ListTile(
            title: Text(
              "Input Data",
              style: TextStyle(
                color: Colors.grey,
                fontFamily: 'BalooChettan',
                fontWeight: FontWeight.bold,
              ),
            ),
          ),

          ListTile(
            leading: const Icon(Icons.point_of_sale),
            title: const Text('Penjualan'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/penjualan');
            },
          ),

          ListTile(
            leading: const Icon(Icons.warehouse),
            title: const Text('Warehouse'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/warehouse');
            },
          ),

          ListTile(
            title: Text(
              "Settings",
              style: TextStyle(
                color: Colors.grey,
                fontFamily: 'BalooChettan',
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.settings),
            title: const Text('Preferensi'),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/settings');
            },
          ),
        ],
      ),
    );
  }
}
