import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import FeeList from "./pages/FeeList";
import AddFeeStructure from "./pages/AddFeeStructure";
import EditFeeStructure from "./pages/EditFeeStructure";
import RecordPayment from "./pages/RecordPayment";
import StudentFeeLedger from "./pages/StudentFeeLedger";
import StudentPortal from "./pages/StudentPortal";
import ReceiptView from "./pages/ReceiptView";
import NotFound from "./pages/NotFound";

function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} />

      <main>
        <Routes>
          {/* Home redirect */}
          <Route
            path="/"
            element={
              user ? (
                user.role === "admin" ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <Navigate to="/my-fees" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Auth routes */}
          <Route
            path="/login"
            element={
              user ? (
                user.role === "admin" ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <Navigate to="/my-fees" replace />
                )
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                user.role === "admin" ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <Navigate to="/my-fees" replace />
                )
              ) : (
                <Register onLoginSuccess={handleLoginSuccess} />
              )
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute user={user} allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/fees"
            element={
              <ProtectedRoute user={user} allowedRole="admin">
                <FeeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/fees/new"
            element={
              <ProtectedRoute user={user} allowedRole="admin">
                <AddFeeStructure />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/fees/:id/edit"
            element={
              <ProtectedRoute user={user} allowedRole="admin">
                <EditFeeStructure />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments/new"
            element={
              <ProtectedRoute user={user} allowedRole="admin">
                <RecordPayment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students/:id/fees"
            element={
              <ProtectedRoute user={user} allowedRole="admin">
                <StudentFeeLedger />
              </ProtectedRoute>
            }
          />

          {/* Student routes */}
          <Route
            path="/my-fees"
            element={
              <ProtectedRoute user={user} allowedRole="student">
                <StudentPortal user={user} />
              </ProtectedRoute>
            }
          />

          {/* Shared dynamic receipt view */}
          <Route
            path="/receipts/:receiptNo"
            element={
              <ProtectedRoute user={user}>
                <ReceiptView user={user} />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
