import React from "react";
import { Navigate, Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "@clerk/clerk-react";
import DashboardPage from "./pages/DashboardPage";
import ProductPage from "./pages/ProductPage";
import OrderPage from "./pages/OrderPage";
import CustomerPage from "./pages/CustomersPage";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  return (
    <Routes>
      <Route
        path="/login"
        element={isSignedIn ? <Navigate to="/dashboard" /> : <LoginPage />}
      />

      <Route
        path="/"
        element={isSignedIn ? <DashboardLayout /> : <Navigate to="/login" />}
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="orders" element={<OrderPage />} />
        <Route path="customer" element={<CustomerPage />} />
      </Route>
    </Routes>
  );
}

export default App;