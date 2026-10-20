import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Calendar, CreditCard, Receipt, Clock, CheckCircle } from "lucide-react";
import { paymentApi } from "../api/feeApi";

const StudentFeeLedger = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await paymentApi.getStudentFees(id);
        setData(res);
      } catch (err) {
        setError(err.message || "Failed to load student fee ledger");
      } finally {
        setLoading(false);
      }
    };
    fetchLedger();
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <div className="state-box">
          <div className="state-spinner"></div>
          <p style={{ color: "var(--text-secondary)" }}>Loading student fee records...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container">
        <div className="alert alert-error">{error || "Student ledger not found"}</div>
        <Link to="/admin/dashboard" className="btn btn-secondary btn-sm">Back to Dashboard</Link>
      </div>
    );
  }

  const { student, feeStructure, summary, payments } = data;

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <Link to="/admin/dashboard" className="btn btn-secondary btn-sm">
          <ArrowLeft size={15} />
          <span>Back to Dashboard</span>
        </Link>
        <Link to="/admin/payments/new" className="btn btn-primary btn-sm">
          <CreditCard size={15} />
          <span>Collect Fee for this Student</span>
        </Link>
      </div>

      {/* Student Profile & Status Card */}
      <div className="glass-panel" style={{ padding: "2rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <User size={22} style={{ color: "var(--accent-blue)" }} />
              <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>{student.name}</h1>
            </div>
            <div style={{ color: "var(--text-secondary)", marginTop: "0.4rem", display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.9rem" }}>
              <span>Roll No: <strong style={{ color: "#fff" }}>{student.rollNumber}</strong></span>
              <span>Course: <strong style={{ color: "#fff" }}>{student.course}</strong></span>
              <span>Email: <strong style={{ color: "#fff" }}>{student.email}</strong></span>
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
              {summary.status}
            </span>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
              Due Date: {summary.dueDate ? new Date(summary.dueDate).toLocaleDateString() : "N/A"}
            </div>
          </div>
        </div>

        {/* Ledger Balance Highlights */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginTop: "1.75rem", borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
          <div style={{ background: "rgba(255,255,255,0.02)", padding: "1rem", borderRadius: "10px" }}>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Base Course Fee</div>
            <div style={{ fontSize: "1.35rem", fontWeight: 700 }}>₹{summary.baseFee.toLocaleString("en-IN")}</div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", padding: "1rem", borderRadius: "10px" }}>
            <div style={{ fontSize: "0.78rem", color: "#fda4af", textTransform: "uppercase" }}>Late Fee Accrued</div>
            <div style={{ fontSize: "1.35rem", fontWeight: 700, color: "#fb7185" }}>
              +₹{summary.lateFee.toLocaleString("en-IN")}
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", padding: "1rem", borderRadius: "10px" }}>
            <div style={{ fontSize: "0.78rem", color: "#6ee7b7", textTransform: "uppercase" }}>Total Paid</div>
            <div style={{ fontSize: "1.35rem", fontWeight: 700, color: "#34d399" }}>
              ₹{summary.totalPaid.toLocaleString("en-IN")}
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", padding: "1rem", borderRadius: "10px" }}>
            <div style={{ fontSize: "0.78rem", color: "#fde047", textTransform: "uppercase" }}>Balance Pending</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fbbf24" }}>
              ₹{summary.pendingAmount.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="glass-panel" style={{ padding: "1.75rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.25rem", color: "#f8fafc" }}>
          Payment History & Receipts ({payments.length})
        </h3>

        {payments.length === 0 ? (
          <div className="state-box">
            <Clock size={32} style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }} />
            <p style={{ color: "var(--text-muted)" }}>No payments recorded yet for this student.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Receipt No</th>
                  <th>Payment Date</th>
                  <th>Mode</th>
                  <th>Reference</th>
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
                    <td>{p.transactionReference || "N/A"}</td>
                    <td>{p.remarks}</td>
                    <td style={{ color: "#34d399", fontWeight: 700 }}>
                      ₹{p.amountPaid.toLocaleString("en-IN")}
                    </td>
                    <td>
                      <Link to={`/receipts/${p.receiptNo}`} className="btn btn-secondary btn-sm">
                        <Receipt size={14} />
                        <span>View Receipt</span>
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

export default StudentFeeLedger;
