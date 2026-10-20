import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Edit2, Trash2, Calendar, Search, AlertCircle, Layers } from "lucide-react";
import { feeApi } from "../api/feeApi";

const FeeList = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const filterCourse = searchParams.get("course") || "";

  const fetchFees = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await feeApi.getAll();
      setFees(res.data);
    } catch (err) {
      setError(err.message || "Failed to load fee structures");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleDelete = async (id, courseName) => {
    if (!window.confirm(`Are you sure you want to delete the fee structure for ${courseName}?`)) {
      return;
    }

    try {
      await feeApi.delete(id);
      setFees(fees.filter((f) => f._id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete fee structure");
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (val) {
      setSearchParams({ course: val });
    } else {
      setSearchParams({});
    }
  };

  const filteredFees = fees.filter((f) =>
    f.course.toLowerCase().includes(filterCourse.toLowerCase())
  );

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Course Fee Structures</h1>
          <p className="page-subtitle">Define fee heads, base charges, deadlines and late fee fines per program</p>
        </div>
        <Link to="/admin/fees/new" className="btn btn-primary">
          <Plus size={16} />
          <span>Add Fee Structure</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="glass-panel" style={{ padding: "1rem 1.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
          <input
            type="text"
            placeholder="Filter courses with URL sync (useSearchParams)..."
            className="form-input"
            style={{ paddingLeft: "2.2rem" }}
            value={filterCourse}
            onChange={handleSearchChange}
          />
          <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
        </div>
        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Showing {filteredFees.length} of {fees.length} structures
        </div>
      </div>

      {loading && (
        <div className="state-box">
          <div className="state-spinner"></div>
          <p style={{ color: "var(--text-secondary)" }}>Loading fee structures...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <div>{error}</div>
        </div>
      )}

      {!loading && !error && filteredFees.length === 0 && (
        <div className="state-box">
          <Layers size={36} style={{ color: "var(--text-muted)", marginBottom: "0.75rem" }} />
          <h3>No Fee Structures Found</h3>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
            {filterCourse ? "No matches for your search term." : "Get started by adding your first course fee structure."}
          </p>
          <Link to="/admin/fees/new" className="btn btn-primary" style={{ marginTop: "1.25rem" }}>
            <Plus size={16} />
            <span>Create Fee Structure</span>
          </Link>
        </div>
      )}

      {!loading && !error && filteredFees.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem" }}>
          {filteredFees.map((fee) => (
            <div key={fee._id} className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff" }}>{fee.course}</h3>
                    <span style={{ fontSize: "0.8rem", color: "var(--accent-cyan)", fontFamily: "var(--font-mono)" }}>
                      AY: {fee.academicYear}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#38bdf8" }}>
                      ₹{fee.totalAmount.toLocaleString("en-IN")}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Total Course Fee</span>
                  </div>
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.02)", borderRadius: "8px", padding: "0.75rem 1rem", margin: "1rem 0", border: "1px solid var(--border-color)" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                    Fee Heads Breakdown
                  </div>
                  {fee.feeHeads?.map((head, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "0.25rem 0", color: "#cbd5e1" }}>
                      <span>{head.title}</span>
                      <span style={{ fontWeight: 600, color: "#f8fafc" }}>₹{head.amount.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Calendar size={14} />
                    <span>Due: {new Date(fee.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    Late Fee: <span style={{ color: "#fb7185", fontWeight: 600 }}>₹{fee.lateFeePerDay}/day</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
                <Link to={`/admin/fees/${fee._id}/edit`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                  <Edit2 size={14} />
                  <span>Edit</span>
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(fee._id, fee.course)}
                  className="btn btn-danger btn-sm"
                  style={{ flex: 1 }}
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeeList;
