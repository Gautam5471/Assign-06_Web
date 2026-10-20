import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Printer, ArrowLeft, CheckCircle2, ShieldCheck, Building2, Calendar, CreditCard, AlertCircle } from "lucide-react";
import { paymentApi } from "../api/feeApi";

const ReceiptView = ({ user }) => {
  const { receiptNo } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await paymentApi.getReceipt(receiptNo);
        setPayment(res.data);
      } catch (err) {
        setError(err.message || "Failed to load receipt");
      } finally {
        setLoading(false);
      }
    };
    fetchReceipt();
  }, [receiptNo]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="state-box">
          <div className="state-spinner"></div>
          <p style={{ color: "var(--text-secondary)" }}>Fetching verified receipt document...</p>
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="container">
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <div>{error || "Receipt document not found"}</div>
        </div>
        <Link to={user?.role === "admin" ? "/admin/dashboard" : "/my-fees"} className="btn btn-secondary btn-sm">
          Return to Portal
        </Link>
      </div>
    );
  }

  return (
    <div className="container receipt-wrapper">
      {/* Top action bar (hidden during print) */}
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <Link to={user?.role === "admin" ? "/admin/dashboard" : "/my-fees"} className="btn btn-secondary btn-sm">
          <ArrowLeft size={15} />
          <span>Back</span>
        </Link>
        <button onClick={handlePrint} className="btn btn-primary btn-sm">
          <Printer size={16} />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable Receipt Voucher */}
      <div className="receipt-card">
        {/* Header */}
        <div className="receipt-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ background: "#2563eb", color: "#fff", padding: "6px", borderRadius: "8px" }}>
                <Building2 size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  INSTITUTE OF TECHNOLOGY & MANAGEMENT
                </h2>
                <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  Department of Accounts & Student Financial Services
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>
              Official Fee Receipt
            </div>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#2563eb", fontFamily: "var(--font-mono)" }}>
              {payment.receiptNo}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
              Date: {new Date(payment.paymentDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Student and Payment Metadata */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#94a3b8", fontWeight: 700, marginBottom: "0.25rem" }}>
              Student Information
            </div>
            <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "#0f172a" }}>{payment.student?.name}</div>
            <div style={{ color: "#475569" }}>Roll No: <strong>{payment.student?.rollNumber}</strong></div>
            <div style={{ color: "#475569" }}>Program: <strong>{payment.student?.course}</strong></div>
            <div style={{ color: "#475569" }}>Email: {payment.student?.email}</div>
          </div>

          <div style={{ borderLeft: "1px dashed #cbd5e1", paddingLeft: "1.5rem" }}>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "#94a3b8", fontWeight: 700, marginBottom: "0.25rem" }}>
              Transaction Information
            </div>
            <div style={{ color: "#475569" }}>Payment Mode: <strong style={{ color: "#0f172a" }}>{payment.paymentMode}</strong></div>
            <div style={{ color: "#475569" }}>Reference No: <strong style={{ fontFamily: "var(--font-mono)" }}>{payment.transactionReference}</strong></div>
            <div style={{ color: "#475569" }}>Academic Session: <strong>{payment.feeStructure?.academicYear || "2026-2027"}</strong></div>
            <div style={{ color: "#475569" }}>Remarks: {payment.remarks}</div>
          </div>
        </div>

        {/* Amount Table */}
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden", marginBottom: "1.5rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ textAlign: "left", padding: "0.75rem 1rem", color: "#64748b" }}>Description</th>
                <th style={{ textAlign: "right", padding: "0.75rem 1rem", color: "#64748b" }}>Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "0.75rem 1rem", color: "#334155" }}>
                  Tuition & Course Fee Payment for {payment.student?.course}
                </td>
                <td style={{ textAlign: "right", padding: "0.75rem 1rem", fontWeight: 700, color: "#0f172a" }}>
                  ₹{payment.amountPaid.toLocaleString("en-IN")}.00
                </td>
              </tr>
              <tr style={{ background: "#f8fafc" }}>
                <td style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "#0f172a" }}>
                  TOTAL AMOUNT RECEIVED
                </td>
                <td style={{ textAlign: "right", padding: "0.85rem 1rem", fontWeight: 800, fontSize: "1.2rem", color: "#16a34a" }}>
                  ₹{payment.amountPaid.toLocaleString("en-IN")}.00
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Verification Footer & Signature */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px dashed #cbd5e1" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#16a34a", fontSize: "0.85rem" }}>
            <CheckCircle2 size={18} />
            <span style={{ fontWeight: 600 }}>System Verified & Digitally Authenticated</span>
          </div>

          <div style={{ textAlign: "center", width: "180px" }}>
            <div style={{ borderBottom: "1px solid #94a3b8", height: "35px" }}></div>
            <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.3rem", fontWeight: 600 }}>
              Authorized Cashier / Accounts
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.72rem", color: "#94a3b8" }}>
          * This is a computer-generated receipt issued by InstiFee Pro. No signature required.
        </div>
      </div>
    </div>
  );
};

export default ReceiptView;
