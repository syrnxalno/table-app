import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EditCustomerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state;

  const [name, setName] = useState(data.entity);
  const [country, setCountry] = useState(data.country);

  const [countries, setCountries] = useState([]);

  // FETCH COUNTRIES FROM MOCK API
  useEffect(() => {
    async function loadCountries() {
      try {
        const res = await fetch("https://685013d7e7c42cfd17974a33.mockapi.io/countries");
        const json = await res.json();

        // Extract only country names
        const countryNames = json.map((item) => item.name);

        setCountries(countryNames);
      } catch (err) {
        console.error("Failed to load countries:", err);
      }
    }

    loadCountries();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "40px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "480px",
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ marginBottom: "20px", fontSize: "22px", fontWeight: "600" }}>
          Edit Customer
        </h2>

        {/* NAME FIELD */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "600", fontSize: "15px" }}>
            Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              marginTop: "6px",
              fontSize: "14px",
            }}
          />
        </div>

        {/* COUNTRY DROPDOWN */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "600", fontSize: "15px" }}>Country</label>

          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginTop: "6px",
              fontSize: "14px",
              background: "white",
            }}
          >
            <option value="">Select Country</option>

            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* BUTTONS */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "8px 16px",
              background: "#ccc",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            style={{
              padding: "8px 16px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
