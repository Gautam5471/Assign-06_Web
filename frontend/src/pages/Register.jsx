import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, AlertCircle } from "lucide-react";
import { authApi } from "../api/feeApi";

const Register = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    rollNumber: "",
    course: "B.Tech Computer Science",
    contactNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const courses = [
    "B.Tech Computer Science",
    "B.Tech Information Technology",
    "MBA Marketing & Finance",
    "Bachelor of Computer Applications",
    "Master of Computer Applications",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await authApi.register(formData);
      onLoginSuccess(res.user, res.token);
      if (res.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/my-fees");
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "540px", paddingTop: "2rem" }}>
      <div className="glass-panel" style={{ padding: "2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 className="page-title" style={{ fontSize: "1.85rem" }}>Create Account</h1>
          <p className="page-subtitle">Join InstiFee Pro as Student or Administrator</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="rahul@student.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              name="password"
              minLength={6}
              className="form-input"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role *</label>
            <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="admin">Accountant / Admin</option>
            </select>
          </div>

          {formData.role === "student" && (
            <>
              <div className="form-group">
                <label className="form-label">Roll Number *</label>
                <input
                  type="text"
                  name="rollNumber"
                  className="form-input"
                  placeholder="e.g. CS-2026-055"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  required={formData.role === "student"}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Enrolled Course *</label>
                <select name="course" className="form-select" value={formData.course} onChange={handleChange}>
                  {courses.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              className="form-input"
              placeholder="e.g. 9876543210"
              value={formData.contactNumber}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.75rem" }} disabled={loading}>
            <UserPlus size={18} />
            <span>{loading ? "Registering..." : "Complete Registration"}</span>
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--accent-blue)", fontWeight: 600 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
