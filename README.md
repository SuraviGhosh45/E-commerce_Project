<div align="center">

# 🛍️ Vendora

### A Full-Stack E-Commerce Platform built with the MERN Stack

A complete shopping experience for customers and a dedicated admin dashboard for managing products, users, orders, and business analytics.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-success?style=for-the-badge)](https://e-commerce-project-two-gamma.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/SuraviGhosh45/E-commerce_Project)

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS_S3-569A31?style=flat&logo=amazons3&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-0C2451?style=flat&logo=razorpay&logoColor=white)

</div>


## 🔎 Overview

Vendora is a full-stack e-commerce web application built using the **MERN** stack. It includes authentication, Google Sign-In, email verification, product management, AWS S3 image storage, cart management, Razorpay test payments, order tracking, admin management, and a responsive UI for desktop, tablet, and mobile devices.

---

## 🌐 Live Demo

| Service | Link |
|---|---|
| **Frontend** | [e-commerce-project-two-gamma.vercel.app](https://e-commerce-project-two-gamma.vercel.app) |
| **Backend API** | [e-commerce-project-mhad.vercel.app](https://e-commerce-project-mhad.vercel.app) |
| **GitHub Repository** | [SuraviGhosh45/E-commerce_Project](https://github.com/SuraviGhosh45/E-commerce_Project) |

> 🔐 For security reasons, production admin credentials are not published here. If admin access is required for evaluation, demo credentials can be provided separately.


## ✨ Features

<table>
<tr>
<td valign="top" width="50%">

### 👤 Customer

- User registration and login
- Email OTP verification
- Google Sign-In
- JWT-based authentication
- Role-based access control
- Browse products
- Product search
- Category-based filtering
- Product details
- Add products to cart
- Increase / decrease cart quantity
- Remove products from cart
- Checkout
- Razorpay test-mode payment
- Order creation
- My Orders and order details
- Order status tracking
- User profile
- Responsive design
- Mobile and tablet navigation

</td>
<td valign="top" width="50%">

### 🛠️ Admin

- Admin authentication
- Role-based admin access
- Admin dashboard
- Product management (add / edit / delete)
- Product image upload using AWS S3
- User management (view / edit / delete)
- Order management
- Update order status
- Sales analytics
- Revenue analytics
- Total orders and business statistics

</td>
</tr>
</table>

---

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js, Vite, Tailwind CSS, React Router DOM, Axios, React Icons |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt, Nodemailer, Google OAuth / Google Identity, Razorpay |
| **Cloud Services** | MongoDB Atlas, AWS S3, Vercel |

---

## 🔐 Authentication

Vendora uses multiple authentication mechanisms:

- Email / password authentication
- Email OTP verification
- Google Sign-In
- JWT authentication
- Role-based access control

Users are assigned one of the following roles:

```text
user
admin
```

---

## 🚀 How to Use

### 1. Open the Website

Visit [e-commerce-project-two-gamma.vercel.app](https://e-commerce-project-two-gamma.vercel.app). The home page provides access to the shop, categories, featured products, and other sections.

### 2. Create a Customer Account

1. Click **Register**.
2. Enter your name, email address, and a password.
3. Submit the registration form.
4. Complete email verification using the OTP.
5. Log in with your registered account.

You can also use **Google Sign-In** to authenticate.

### 3. Browse Products

1. Open **Shop**.
2. Use the search bar or categories to find products.
3. Open a product to view its details.
4. Select the required quantity and add it to the cart.

### 4. Manage the Cart

Open **Cart** from the navigation bar. You can view selected products, increase or decrease quantity, remove products, view the total amount, and continue to checkout.

### 5. Place an Order

1. Open the cart and review products and quantities.
2. Continue to checkout and enter the required information.
3. Select the payment option.
4. Complete the Razorpay test payment.
5. After successful payment, the order is created.

> 💳 Razorpay is configured in **Test Mode**, so no real money is charged.

### 6. View My Orders

| Device | Steps |
|---|---|
| **Desktop** | Click **My Orders** directly from the navigation bar. |
| **Mobile / Tablet** | Open the navigation menu → select **My Orders** → select an order to view its details. |

The order details page shows information about the selected order and its current status.

---

## 🧑‍💼 Admin Workflow

Vendora includes a separate admin dashboard.

<details>
<summary><b>📊 Dashboard</b></summary>

<br>

Provides an overview of total users, total orders, product information, sales information, revenue, and business statistics.

</details>

<details>
<summary><b>📦 Product Management</b></summary>

<br>

1. Open **Products**.
2. Add a new product.
3. Upload a product image (stored on **AWS S3**).
4. Enter product information.
5. Edit or delete existing products.

</details>

<details>
<summary><b>👥 User Management</b></summary>

<br>

- View registered users
- Search users
- Edit users
- Delete users
- Manage user roles

</details>

<details>
<summary><b>🧾 Order Management</b></summary>

<br>

1. Open **Orders**.
2. View customer orders.
3. Open individual orders and review order information.
4. Update the order status.

</details>

<details>
<summary><b>📈 Analytics</b></summary>

<br>

Shows total orders, delivered orders, revenue, sales information, and product / order statistics.

> Revenue calculations are based on **delivered orders**.

</details>

---

## 💻 Getting Started (Local Setup)

> ⚠️ Adjust folder names and environment variable names below to match your project.

### Prerequisites

- Node.js (v18 or later recommended)
- A MongoDB Atlas cluster (or local MongoDB)
- AWS S3 bucket, Razorpay test keys, Google OAuth client ID, and an email account for Nodemailer

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/SuraviGhosh45/E-commerce_Project.git
cd E-commerce_Project

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file in the backend folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Email (Nodemailer)
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password

# Google Sign-In
GOOGLE_CLIENT_ID=your_google_client_id

# Razorpay (Test Mode)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_BUCKET_NAME=your_bucket_name
```

Create a `.env` file in the frontend folder:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_RAZORPAY_KEY_ID=your_key_id
```

### Run the App

```bash
# Backend
cd backend
npm run dev

# Frontend (in a new terminal)
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## 👩‍💻 Author

**Suravi Ghosh**

[![GitHub](https://img.shields.io/badge/GitHub-SuraviGhosh45-181717?style=flat&logo=github)](https://github.com/SuraviGhosh45)

---

<div align="center">

⭐ If you found this project useful, consider giving it a star!

</div>
