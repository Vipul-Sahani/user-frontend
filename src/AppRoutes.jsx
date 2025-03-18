
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Index from "./components/Pages";
import HomePage from "./components/Pages/HomePage";
import LoginPage from "./components/Pages/Loginpage";
import SignupPage from "./components/Pages/SignupPage";
import ProductDetailPage from "./components/Pages/ProductDetailPage";
import ProfilePage from "./components/Pages/ProfilePage";
import OrderPage from "./components/Pages/OrderPage"; // Import OrderPage

function AppRoutes() {
  const [cookies] = useCookies(["jwtToken"]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!cookies.jwtToken);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route
        path="/home"
        element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
      />
      <Route
        path="/login"
        element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
      />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route
        path="/orders"
        element={isAuthenticated ? <OrderPage /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default AppRoutes;
