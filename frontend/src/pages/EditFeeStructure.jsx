import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FeeStructureForm from "../components/FeeStructureForm";
import { feeApi } from "../api/feeApi";

const EditFeeStructure = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFee = async () => {
      try {
        setLoadingData(true);
        setError(null);
        const res = await feeApi.getById(id);
        setInitialData(res.data);
      } catch (err) {
        setError(err.message || "Failed to load fee structure");
      } finally {
        setLoadingData(false);
      }
    };

    fetchFee();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      setSaving(true);
      setError(null);
      await feeApi.update(id, formData);
      navigate("/admin/fees");
    } catch (err) {
      setError(err.message || "Failed to update fee structure");
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) {
    return (
      <div className="container">
        <div className="state-box">
          <div className="state-spinner"></div>
          <p style={{ color: "var(--text-secondary)" }}>Loading fee structure details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <FeeStructureForm
        isEdit={true}
        initialData={initialData}
        onSubmit={handleUpdate}
        loading={saving}
        error={error}
      />
    </div>
  );
};

export default EditFeeStructure;
