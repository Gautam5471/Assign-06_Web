import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, AlertCircle, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { authApi, paymentApi } from "../api/feeApi";

const RecordPayment = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [studentSummary, setStudentSummary] = useState(null);
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [transactionReference, setTransactionReference] = useState("");
  const [remarks, setRemarks] = useState("");

  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        const res = await authApi.getStudents();
        setStudents(res.students);
        if (res.students.length > 0) {
          setSelectedStudentId(res.students[0]._id);
        }
      } catch (err) {
        setError(err.message || "Failed to load students");
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    if (!selectedStudentId) return;

    const fetchSummary = async () => {
      try {
        setLoadingSummary(true);
        setError(null);
        setSuccess(null);
        const res = await paymentApi.getStudentFees(selectedStudentId);
        setStudentSummary(res);
        if (res.summary.pendingAmount > 0) {
          setAmountPaid(res.summary.pendingAmount.toString());
        } else {
          setAmountPaid("");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch student ledger");
      } finally {
        setLoadingSummary(false);
      }
    };

    fetchSummary();
  }, [selectedStudentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const numericAmount = Number(amountPaid);
    if (!numericAmount || numericAmount <= 0) {
      setError("Payment amount must be strictly greater than zero.");
      setSubmitting(false);
      return;
    }

    if (studentSummary && numericAmount > studentSummary.summary.pendingAmount) {
      setError(`Payment amount (₹${numericAmount}) cannot exceed pending dues of ₹${studentSummary.summary.pendingAmount}.`);
      setSubmitting(false);
      return;
    }

    try {
      const res = await paymentApi.recordPayment({
        studentId: selectedStudentId,
        amountPaid: numericAmount,
        paymentMode,
        transactionReference,
        remarks,
      });

      setSuccess({
        message: "Payment successfully recorded!",
        receiptNo: res.data.receiptNo,
        amount: res.data.amountPaid,
      });

      const updated = await paymentApi.getStudentFees(selectedStudentId);
      setStudentSummary(updated);
    } catch (err) {
      setError(err.message || "Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "800px" }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Collect Fee Payment</h1>
          <p className="page-subtitle">Accept student payments with automatic ledger updating and receipt issuance</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success" style={{ flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CheckCircle size={20} />
            <strong>{success.message}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginTop: "0.25rem" }}>
            <span>Issued Receipt: <strong style={{ fontFamily: "var(--font-mono)" }}>{success.receiptNo}</strong></span>
            <button
              onClick={() => navigate(`/receipts/${success.receiptNo}`)}
              className="btn btn-success btn-sm"
            >
              <span>View & Print Receipt</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: "2rem" }}>
        {/* Student Selector */}
        <div className="form-group">
          <label className="form-label">Select Student Account *</label>
          {loadingStudents ? (
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading students list...</div>
          ) : (
            <select
              className="form-select"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              required
            >
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.rollNumber}) — {s.course}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Student Dues Summary Preview */}
        {studentSummary && (
          <div
            style={{
              padding: "1.25rem",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border-color)",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>
                Current Ledger Status
              </span>
              <span
                className={`badge ${
                  studentSummary.summary.status === "Paid"
                    ? "badge-paid"
                    : studentSummary.summary.status === "Partially Paid"
                    ? "badge-partial"
                    : "badge-unpaid"
                }`}
              >
                {studentSummary.summary.status}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Total Course Fee</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>₹{studentSummary.summary.baseFee.toLocaleString("en-IN")}</div>
              </div>
              {studentSummary.summary.lateFee > 0 && (
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#fda4af" }}>Late Fee Accrued</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fb7185" }}>
                    +₹{studentSummary.summary.lateFee.toLocaleString("en-IN")}
                  </div>
                </div>
              )}
              <div>
                <div style={{ fontSize: "0.75rem", color: "#34d399" }}>Total Paid So Far</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#34d399" }}>
                  ₹{studentSummary.summary.totalPaid.toLocaleString("en-IN")}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#fbbf24" }}>Pending Due</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fbbf24" }}>
                  ₹{studentSummary.summary.pendingAmount.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Amount & Mode */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="form-group">
            <label className="form-label">Payment Amount (₹) *</label>
            <input
              type="number"
              min="1"
              max={studentSummary?.summary?.pendingAmount || undefined}
              className="form-input"
              placeholder="e.g. 25000"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              required
            />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem", display: "block" }}>
              Partial payments allowed. Overpayment strictly rejected.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Payment Mode *</label>
            <select
              className="form-select"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option value="UPI">UPI / QR Code</option>
              <option value="Cash">Cash at Counter</option>
              <option value="Card">Debit / Credit Card</option>
              <option value="NetBanking">Net Banking / IMPS</option>
            </select>
          </div>
        </div>

        {/* Reference & Remarks */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="form-group">
            <label className="form-label">Transaction Reference</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. UPI-TXN-998811 or Cash Desk 1"
              value={transactionReference}
              onChange={(e) => setTransactionReference(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Remarks / Note</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Semester 1 installment"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", marginTop: "1rem" }}
          disabled={submitting || !studentSummary || studentSummary.summary.pendingAmount === 0}
        >
          <CreditCard size={18} />
          <span>
            {submitting
              ? "Processing Payment..."
              : studentSummary?.summary?.pendingAmount === 0
              ? "Fee Fully Settled"
              : "Confirm & Generate Receipt"}
          </span>
        </button>
      </form>
    </div>
  );
};

export default RecordPayment;
