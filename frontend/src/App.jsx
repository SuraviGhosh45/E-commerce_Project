
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
        
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default App;

