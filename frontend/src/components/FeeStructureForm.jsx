import React, { useState } from "react";
import { Plus, Trash2, ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";

const FeeStructureForm = ({ initialData, onSubmit, isEdit, loading, error }) => {
  const [course, setCourse] = useState(initialData?.course || "");
  const [academicYear, setAcademicYear] = useState(initialData?.academicYear || "2026-2027");
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split("T")[0] : ""
  );
  const [lateFeePerDay, setLateFeePerDay] = useState(
    initialData?.lateFeePerDay !== undefined ? initialData.lateFeePerDay : 50
  );
  const [feeHeads, setFeeHeads] = useState(
    initialData?.feeHeads && initialData.feeHeads.length > 0
      ? initialData.feeHeads
      : [{ title: "Tuition Fee", amount: 50000 }]
  );

  const handleHeadChange = (index, field, value) => {
    const updated = [...feeHeads];
    updated[index][field] = field === "amount" ? Number(value) : value;
    setFeeHeads(updated);
  };

  const addHead = () => {
    setFeeHeads([...feeHeads, { title: "", amount: 0 }]);
  };

  const removeHead = (index) => {
    if (feeHeads.length === 1) return;
    setFeeHeads(feeHeads.filter((_, i) => i !== index));
  };

  const totalCalculated = feeHeads.reduce((sum, h) => sum + (Number(h.amount) || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      course,
      academicYear,
      feeHeads,
      dueDate,
      lateFeePerDay: Number(lateFeePerDay),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.35rem", fontWeight: 700 }}>
          {isEdit ? "Edit Course Fee Structure" : "Create New Fee Structure"}
        </h2>
        <Link to="/admin/fees" className="btn btn-secondary btn-sm">
          <ArrowLeft size={15} />
          <span>Back to List</span>
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div className="form-group">
          <label className="form-label">Course Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. B.Tech Computer Science"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Academic Year *</label>
          <input
            type="text"
            className="form-input"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            required
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div className="form-group">
          <label className="form-label">Fee Due Date *</label>
          <input
            type="date"
            className="form-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Late Fee Per Day (₹)</label>
          <input
            type="number"
            min="0"
            className="form-input"
            value={lateFeePerDay}
            onChange={(e) => setLateFeePerDay(e.target.value)}
            required
          />
        </div>
      </div>

      <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <label className="form-label" style={{ margin: 0 }}>Fee Breakdown Heads *</label>
          <button type="button" onClick={addHead} className="btn btn-secondary btn-sm">
            <Plus size={14} />
            <span>Add Fee Head</span>
          </button>
        </div>

        {feeHeads.map((head, idx) => (
          <div key={idx} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Fee head title (e.g. Tuition, Lab, Exam)"
              className="form-input"
              value={head.title}
              onChange={(e) => handleHeadChange(idx, "title", e.target.value)}
              required
            />
            <input
              type="number"
              min="0"
              placeholder="Amount (₹)"
              className="form-input"
              style={{ width: "160px" }}
              value={head.amount}
              onChange={(e) => handleHeadChange(idx, "amount", e.target.value)}
              required
            />
            {feeHeads.length > 1 && (
              <button
                type="button"
                onClick={() => removeHead(idx)}
                className="btn btn-danger btn-sm"
                title="Remove Fee Head"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem",
            background: "rgba(59, 130, 246, 0.08)",
            borderRadius: "8px",
            border: "1px dashed rgba(59, 130, 246, 0.3)",
            marginTop: "1rem",
          }}
        >
          <span style={{ fontWeight: 600, color: "#93c5fd" }}>Total Calculated Course Fee:</span>
          <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#60a5fa" }}>
            ₹{totalCalculated.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
        <Save size={18} />
        <span>{loading ? "Saving..." : isEdit ? "Update Fee Structure" : "Save Fee Structure"}</span>
      </button>
    </form>
  );
};

export default FeeStructureForm;
