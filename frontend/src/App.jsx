
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


const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/verify-otp" element={<VerifyOTP />} />

        <Route path="/shop" element={<Products/>}/>

        <Route path="/products/:id" element={<ProductDetails/>} />

        <Route path="/cart" element={<Cart/>}/>

        <Route path="/checkout" element={<Checkout/>}/>

        <Route path="/orders/:id" element={<OrderDetails/>} />

        <Route path="/orders" element={<Orders/>} />

        <Route path="/payment" element={<Payment/>} />

        <Route path="/order-success" element={<OrderSuccess/>} />

      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default App;

