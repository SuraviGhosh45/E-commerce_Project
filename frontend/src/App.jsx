import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home/Home";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import VerifyOTP from "./pages/VerifyOTP/VerifyOTP";

import Products from "./pages/Products/Products";
import ProductDetails from "./pages/Products/ProductDetails";
import Cart from "./pages/Products/Cart";

import Checkout from "./pages/Orders/Checkout";
import OrderDetails from "./pages/Orders/OrderDetails";
import Orders from "./pages/Orders/Orders";
import Payment from "./pages/Orders/Payment";
import OrderSuccess from "./pages/Orders/OrderSuccess";

import Dashboard from "./pages/Admin/Dashboard";
import OrderAdmin from "./pages/Admin/OrderAdmin";
import ProductAdmin from "./pages/Admin/ProductAdmin";
import UserAdmin from "./pages/Admin/UsersAdmin";
import Analytics from "./pages/Admin/Analytics";

import Categories from "./pages/Categories/Categories";
import Profile from "./pages/Profile/Profile";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* ================= PUBLIC ================= */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/verify-otp"
          element={<VerifyOTP />}
        />

        <Route path="/shop" element={<Products />} />

        <Route
          path="/categories"
          element={<Categories />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route path="/cart" element={<Cart />} />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/payment"
          element={<Payment />}
        />

        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />

        {/* ================= CUSTOMER ORDERS ================= */}

        <Route path="/orders" element={<Orders />} />

        <Route
          path="/orders/:id"
          element={<OrderDetails />}
        />

        {/* ================= PROFILE ================= */}

        <Route path="/profile" element={<Profile />} />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/admin/products"
          element={<ProductAdmin />}
        />

        <Route
          path="/admin/orders"
          element={<OrderAdmin />}
        />

        <Route
          path="/admin/users"
          element={<UserAdmin />}
        />

        <Route
          path="/admin/analytics"
          element={<Analytics />}
        />

        <Route
          path="/admin/orders/:id"
          element={<OrderDetails/>}
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default App;