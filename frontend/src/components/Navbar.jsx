import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  CreditCard,
  Receipt,
  LogOut,
  LogIn,
  UserCheck,
  ShieldAlert,
  Wallet
} from "lucide-react";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <div className="brand-icon">
          <Wallet size={20} />
        </div>
        <span>InstiFee Pro</span>
      </Link>

      <div className="nav-links">
        {user ? (
          <>
            {user.role === "admin" ? (
              <>
                <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  <LayoutDashboard size={17} />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/admin/fees" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  <Layers size={17} />
                  <span>Fee Structures</span>
                </NavLink>
                <NavLink to="/admin/payments/new" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  <CreditCard size={17} />
                  <span>Record Payment</span>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/my-fees" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  <Receipt size={17} />
                  <span>My Fees & History</span>
                </NavLink>
              </>
            )}
          </>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              <LogIn size={17} />
              <span>Login</span>
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              <UserCheck size={17} />
              <span>Register</span>
            </NavLink>
          </>
        )}
      </div>

      <div className="nav-user">
        {user ? (
          <>
            <div className="user-badge">
              <span className={`role-pill ${user.role}`}>{user.role}</span>
              <span style={{ fontWeight: 600, color: "#e2e8f0" }}>{user.name}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log out">
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
