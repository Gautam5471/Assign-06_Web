import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FeeStructureForm from "../components/FeeStructureForm";
import { feeApi } from "../api/feeApi";

const AddFeeStructure = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      await feeApi.create(formData);
      navigate("/admin/fees");
    } catch (err) {
      setError(err.message || "Failed to create fee structure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <FeeStructureForm
        isEdit={false}
        onSubmit={handleCreate}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default AddFeeStructure;
