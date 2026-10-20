import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  AlertTriangle,
  Users,
  CreditCard,
  Plus,
  ArrowRight,
  Receipt,
  Search
} from "lucide-react";
import { paymentApi } from "../api/feeApi";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await paymentApi.getDashboard();
      setData(res.data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="state-box">
          <div className="state-spinner"></div>
          <p style={{ color: "var(--text-secondary)" }}>Loading live financial dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">
          <AlertTriangle size={20} />
          <div>
            <strong>Error loading dashboard:</strong> {error}
          </div>
        </div>
        <button onClick={fetchDashboard} className="btn btn-primary btn-sm">Try Again</button>
      </div>
    );
  }

  const filteredDefaulters = (data?.defaulters || []).filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Finance Dashboard</h1>
          <p className="page-subtitle">Real-time overview of fee collections, dues, and overdue accounts</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link to="/admin/payments/new" className="btn btn-primary">
            <Plus size={16} />
            <span>Record Payment</span>
          </Link>
          <Link to="/admin/fees" className="btn btn-secondary">
            <span>Manage Fee Structures</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            <TrendingUp size={22} />
          </div>
          <div className="stat-label">Total Fee Collected</div>
          <div className="stat-value" style={{ color: "#34d399" }}>
            ₹{(data?.totalCollected || 0).toLocaleString("en-IN")}
          </div>
          <div className="stat-sub">Across all courses & terms</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(244, 63, 94, 0.15)", color: "#f43f5e" }}>
            <AlertTriangle size={22} />
          </div>
          <div className="stat-label">Total Pending Dues</div>
          <div className="stat-value" style={{ color: "#fb7185" }}>
            ₹{(data?.totalPending || 0).toLocaleString("en-IN")}
          </div>
          <div className="stat-sub">Includes applicable late fee fines</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>
            <Users size={22} />
          </div>
          <div className="stat-label">Enrolled Students</div>
          <div className="stat-value">
            {data?.totalStudents || 0}
          </div>
          <div className="stat-sub">Active registered learners</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
            <CreditCard size={22} />
          </div>
          <div className="stat-label">Overdue Defaulters</div>
          <div className="stat-value" style={{ color: "#fbbf24" }}>
            {data?.defaultersCount || 0}
          </div>
          <div className="stat-sub">Passed deadline without full fee</div>
        </div>
      </div>

      {/* Mode-wise Collection Breakdown */}
      <div className="glass-panel" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem", color: "#0f172a" }}>
          Payment Mode Distribution
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
          {data?.modeWiseCollection &&
            Object.entries(data.modeWiseCollection).map(([mode, amt]) => (
              <div
                key={mode}
                style={{
                  padding: "1rem 1.25rem",
                  background: "#f8fafc",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ fontSize: "0.8rem", color: "#475569", textTransform: "uppercase", fontWeight: 600 }}>{mode}</div>
                <div style={{ fontSize: "1.35rem", fontWeight: 800, marginTop: "0.25rem", color: "#0f172a" }}>
                  ₹{amt.toLocaleString("en-IN")}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Overdue Defaulters List */}
      <div className="glass-panel" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#b91c1c" }}>
              Overdue Fee Defaulters ({filteredDefaulters.length})
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
              Students who have past-due pending balances subject to daily late fees
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search defaulter..."
                className="form-input"
                style={{ width: "240px", paddingLeft: "2rem", paddingBottom: "0.45rem", paddingTop: "0.45rem" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={14} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            </div>
          </div>
        </div>

        {filteredDefaulters.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
            No overdue defaulters found matching your criteria.
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Roll Number</th>
                  <th>Course</th>
                  <th>Due Date</th>
                  <th>Overdue</th>
                  <th>Paid</th>
                  <th>Pending Due</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDefaulters.map((d) => (
                  <tr key={d.studentId}>
                    <td style={{ fontWeight: 600, color: "#0f172a" }}>{d.name}</td>
                    <td><span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#334155" }}>{d.rollNumber}</span></td>
                    <td>{d.course}</td>
                    <td>{new Date(d.dueDate).toLocaleDateString()}</td>
                    <td>
                      <span className="badge badge-unpaid">+{d.overdueDays} days</span>
                    </td>
                    <td>₹{d.paidAmount.toLocaleString("en-IN")}</td>
                    <td style={{ color: "#b91c1c", fontWeight: 700 }}>
                      ₹{d.pendingAmount.toLocaleString("en-IN")}
                    </td>
                    <td>
                      <Link to={`/admin/students/${d.studentId}/fees`} className="btn btn-secondary btn-sm">
                        <span>Ledger</span>
                        <ArrowRight size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Collections */}
      <div className="glass-panel" style={{ padding: "1.75rem" }}>
        <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "1.25rem", color: "#0f172a" }}>
          Recent Transactions & Receipts
        </h3>

        {(!data?.recentPayments || data.recentPayments.length === 0) ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
            No transactions recorded yet.
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Receipt No</th>
                  <th>Date</th>
                  <th>Student</th>
                  <th>Roll No</th>
                  <th>Course</th>
                  <th>Mode</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.recentPayments.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <span style={{ fontFamily: "monospace", color: "#2563eb", fontWeight: 600 }}>
                        {p.receiptNo}
                      </span>
                    </td>
                    <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 600, color: "#0f172a" }}>{p.student?.name}</td>
                    <td>{p.student?.rollNumber}</td>
                    <td>{p.student?.course}</td>
                    <td><span className="badge badge-paid">{p.paymentMode}</span></td>
                    <td style={{ color: "#059669", fontWeight: 700 }}>
                      ₹{p.amountPaid.toLocaleString("en-IN")}
                    </td>
                    <td>
                      <Link to={`/receipts/${p.receiptNo}`} className="btn btn-secondary btn-sm">
                        <Receipt size={14} />
                        <span>Receipt</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
