import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Receipt, Calendar, Clock, CreditCard, AlertCircle } from "lucide-react";
import { paymentApi } from "../api/feeApi";

const StudentPortal = ({ user }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyFees = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await paymentApi.getMyFees();
        setData(res);
      } catch (err) {
        setError(err.message || "Failed to load fee statement");
      } finally {
        setLoading(false);
      }
    };

    fetchMyFees();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="state-box">
          <div className="state-spinner"></div>
          <p style={{ color: "var(--text-secondary)" }}>Loading your fee summary and receipt history...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container">
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <div>{error || "Unable to retrieve fee records"}</div>
        </div>
      </div>
    );
  }

  const { student, feeStructure, summary, payments } = data;

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Fee Statement & Receipts</h1>
          <p className="page-subtitle">Welcome back, {student.name} • Roll No: {student.rollNumber}</p>
        </div>
      </div>

      {/* Fee Status Summary Card */}
      <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Enrolled Course Program
            </span>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginTop: "0.25rem" }}>{student.course}</h2>
            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              Academic Year: {feeStructure?.academicYear || "2026-2027"}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <span
              className={`badge ${
                summary.status === "Paid"
                  ? "badge-paid"
                  : summary.status === "Partially Paid"
                  ? "badge-partial"
                  : "badge-unpaid"
              }`}
              style={{ fontSize: "0.85rem", padding: "0.45rem 1rem" }}
            >
              Status: {summary.status}
            </span>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
              Due Date: {summary.dueDate ? new Date(summary.dueDate).toLocaleDateString() : "N/A"}
            </div>
          </div>
        </div>

        {/* Financial Highlights */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginTop: "1.75rem", borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
          <div style={{ background: "rgba(255,255,255,0.02)", padding: "1.2rem", borderRadius: "10px" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Total Course Fee</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800 }}>₹{summary.baseFee.toLocaleString("en-IN")}</div>
          </div>

          {summary.lateFee > 0 && (
            <div style={{ background: "rgba(244, 63, 94, 0.05)", padding: "1.2rem", borderRadius: "10px", border: "1px solid rgba(244, 63, 94, 0.2)" }}>
              <div style={{ fontSize: "0.8rem", color: "#fda4af", textTransform: "uppercase" }}>Late Fine Accrued</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fb7185" }}>
                +₹{summary.lateFee.toLocaleString("en-IN")}
              </div>
            </div>
          )}

          <div style={{ background: "rgba(16, 185, 129, 0.05)", padding: "1.2rem", borderRadius: "10px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
            <div style={{ fontSize: "0.8rem", color: "#6ee7b7", textTransform: "uppercase" }}>Total Paid</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#34d399" }}>
              ₹{summary.totalPaid.toLocaleString("en-IN")}
            </div>
          </div>

          <div style={{ background: "rgba(245, 158, 11, 0.05)", padding: "1.2rem", borderRadius: "10px", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
            <div style={{ fontSize: "0.8rem", color: "#fde047", textTransform: "uppercase" }}>Pending Balance</div>
            <div style={{ fontSize: "1.55rem", fontWeight: 800, color: "#fbbf24" }}>
              ₹{summary.pendingAmount.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* Course Fee Heads Breakdown */}
        {feeStructure?.feeHeads && feeStructure.feeHeads.length > 0 && (
          <div style={{ marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px dashed var(--border-color)" }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              Fee Head Component Breakdown
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
              {feeStructure.feeHeads.map((h, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0.9rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px", fontSize: "0.85rem" }}>
                  <span style={{ color: "var(--text-secondary)" }}>{h.title}</span>
                  <span style={{ fontWeight: 600, color: "#fff" }}>₹{h.amount.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Receipts and Payment History */}
      <div className="glass-panel" style={{ padding: "1.75rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.25rem", color: "#f8fafc" }}>
          Official Receipts & Payment Records ({payments.length})
        </h3>

        {payments.length === 0 ? (
          <div className="state-box">
            <Clock size={36} style={{ color: "var(--text-muted)", marginBottom: "0.75rem" }} />
            <h3>No Payments Recorded Yet</h3>
            <p style={{ color: "var(--text-muted)", marginTop: "0.4rem" }}>
              Please visit the campus accounts office or pay via your enrolled batch desk.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Receipt No</th>
                  <th>Payment Date</th>
                  <th>Mode</th>
                  <th>Transaction Reference</th>
                  <th>Remarks</th>
                  <th>Amount Paid</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <span style={{ fontFamily: "var(--font-mono)", color: "#60a5fa", fontWeight: 600 }}>
                        {p.receiptNo}
                      </span>
                    </td>
                    <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                    <td><span className="badge badge-paid">{p.paymentMode}</span></td>
                    <td>{p.transactionReference}</td>
                    <td>{p.remarks}</td>
                    <td style={{ color: "#34d399", fontWeight: 700 }}>
                      ₹{p.amountPaid.toLocaleString("en-IN")}
                    </td>
                    <td>
                      <Link to={`/receipts/${p.receiptNo}`} className="btn btn-secondary btn-sm">
                        <Receipt size={14} />
                        <span>Print Receipt</span>
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

export default StudentPortal;
