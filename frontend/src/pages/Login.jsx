import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Key, Mail, AlertCircle } from "lucide-react";
import { authApi } from "../api/feeApi";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await authApi.login({ email, password });
      onLoginSuccess(res.user, res.token);
      if (res.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/my-fees");
      }
    } catch (err) {
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const fillQuickLogin = (role) => {
    if (role === "admin") {
      setEmail("admin@institute.edu");
      setPassword("adminpassword123");
    } else {
      setEmail("aarav.sharma@student.edu");
      setPassword("studentpassword123");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "480px", paddingTop: "3rem" }}>
      <div className="glass-panel" style={{ padding: "2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 className="page-title" style={{ fontSize: "1.85rem" }}>Sign In</h1>
          <p className="page-subtitle">InstiFee Pro • Fee Collection & Receipt Management</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                className="form-input"
                placeholder="name@institute.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }} disabled={loading}>
            <LogIn size={18} />
            <span>{loading ? "Signing in..." : "Sign In"}</span>
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem", fontWeight: 600 }}>
            QUICK DEMO CREDENTIALS:
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={() => fillQuickLogin("admin")}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
            >
              Admin / Accountant
            </button>
            <button
              type="button"
              onClick={() => fillQuickLogin("student")}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
            >
              Student
            </button>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
          Don't have an account? <Link to="/register" style={{ color: "var(--accent-blue)", fontWeight: 600 }}>Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
