import React from "react";
import { Link } from "react-router-dom";
import { AlertOctagon, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="container" style={{ textAlign: "center", paddingTop: "5rem" }}>
      <div className="state-box" style={{ maxWidth: "500px", margin: "0 auto" }}>
        <AlertOctagon size={48} style={{ color: "#fb7185", marginBottom: "1rem" }} />
        <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>404 - Page Not Found</h1>
        <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", marginBottom: "1.5rem" }}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
