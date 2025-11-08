# Wisely: Warehouse Management System

## 📌 Project Overview

This Warehouse Management System is designed to help businesses efficiently manage their inventory, track stock levels, and monitor transactions such as sales, restocks, and adjustments. The system ensures accurate stock tracking and provides insights on **best-selling products** and **restock recommendations**.

## 🚀 Features

  * **Product Management:** Add, update, and remove products.
  * **Transaction Management:** Log sales, restocks, and stock adjustments.
  * **Stock Tracking:** Monitor current stock levels in **real-time**.
  * **Automated Reports:** Generate reports for daily sales, best-selling products, and restock suggestions.
  * **Notification System:** Notify users when stock of a certain product is low.
  * **Optimized Queries:** Leverages **Supabase Views/Functions** for efficient stock and transaction data retrieval.

-----

## 🏗️ Tech Stack

### Backend:

  * **Supabase:** Provides a robust backend as a service, including **PostgreSQL** database, **real-time subscriptions**, and **authentication**.
  * **PostgreSQL:** The core relational database managed by Supabase.
  * **Supabase Client Libraries:** Used for seamless interaction between the frontend and the database.

### Frontend:

  * **React:** A declarative, component-based JavaScript library for building user interfaces.
  * **Vite:** A next-generation frontend tooling that provides a fast and optimized development experience.

-----

## 📂 Database Schema

### Tables:

  * `products`: Stores product details (id, name, price, stock, etc.).
  * `transactions`: Logs sales, restocks, and adjustments.
  * `transaction_items`: Tracks detail transactions
  * `type_transaction`: Stores transaction types (sale, restock, adjustment, etc.).
  * `categories`: Stores categories set by users
  * `categories_product`: Stores categories of each product
  * `suppliers`: Stores suppliers

### Views & Functions (Supabase):

  * `view_transaction`: Aggregates transaction details for reporting.
  * `view_transaction_item`: View Transaction details
  * `view_products`: Optimized view for querying product data.
  * `view_product_sales`: View product sales
  * `function complete_sale()`: Function to update transaction and stocks in products
  * `function check_low_stock()`: Function to check low stock of each product

-----

## 🔧 Installation & Setup

### 1\. Clone the repository:

```bash
git clone https://github.com/nervouswilliam/WISE.git
cd warehouse-management
```

### 2\. Set up Supabase:

  * Create a new Supabase project.
  * Execute the necessary **SQL migration scripts** (schema, tables, views) provided in the project's documentation.
  * Get your Supabase **Project URL** and **Anon Key**.

### 3\. Frontend Setup (React/Vite):

```bash
cd frontend
npm install
```

  * Create a `.env` file in the `frontend` directory with your Supabase credentials:

    ```
    VITE_SUPABASE_URL=YOUR_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

### 4\. Run the Frontend:

```bash
npm run dev
```

### 5\. Running Different Environments:

  * Modify the `npm run dev` script or use configuration files to manage different environment variables for **DEV**, **UAT**, and **PROD**. *(The Supabase approach typically uses environment variables directly in the frontend build.)*

-----

## 📊 Future Enhancements

  * Implement **AI-based stock prediction** leveraging Supabase's PostgreSQL extensibility.
  * Introduce **role-based authentication (RLS)** using Supabase for better security and access control.
  * Improve UI with advanced, responsive dashboards using React components.

## 🤝 Contributing

Feel free to submit issues and pull requests to improve the project\!

-----

**🛠️ Developed by Jeremiah William Sebastian 🎯**

-----
