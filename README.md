Warehouse Management System

📌 Project Overview

This Warehouse Management System is designed to help businesses efficiently manage their inventory, track stock levels, and monitor transactions such as sales, restocks, and adjustments. The system ensures accurate stock tracking and provides insights on best-selling products and restock recommendations.

🚀 Features

Product Management: Add, update, and remove products.

Transaction Management: Log sales, restocks, and stock adjustments.

Stock Tracking: Monitor current stock levels in real-time.

Automated Reports: Generate reports for daily sales, best-selling products, and restock suggestions.

Materialized Views: Used for optimized stock and transaction queries.

🏗️ Tech Stack

Backend:

Spring Boot (Java 17) – REST API

PostgreSQL – Database

JDBC Template – Database operations

Frontend:

Flutter

📂 Database Schema

Tables:

products: Stores product details (id, name, price, stock, etc.).

transactions: Logs sales, restocks, and adjustments.

type_transaction: Stores transaction types (sale, restock, adjustment, etc.).

product_stock: Tracks stock level changes over time.

Views:

view_transaction: Aggregates transaction details for reporting.

view_products: Optimized view for querying product data.

🔧 Installation & Setup

Clone the repository:

git clone https://github.com/nervouswilliam/wise.git
cd warehouse-management

Set up the database:

Create a PostgreSQL database

Update application.properties with:

spring.datasource.url=jdbc:postgresql://localhost:5432/your_db
spring.datasource.username=your_username
spring.datasource.password=your_password

Run database migrations:

./mvnw flyway:migrate

Start the backend server:

./mvnw spring-boot:run

Start the frontend:

cd frontend
npm install
npm start

📊 Future Enhancements

Implement AI-based stock prediction.

Introduce role-based authentication for better security.

Improve UI with advanced dashboards.

🤝 Contributing

Feel free to submit issues and pull requests to improve the project!

🛠️ Developed by Jeremiah William Sebastian 🎯
