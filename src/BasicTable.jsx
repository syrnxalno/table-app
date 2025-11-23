import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

// Define the expected structure for a Tax Row and Country
// This helps ensure the column accessors are correct.
// Assuming 'taxes' endpoint returns objects with these keys:
// id, entity, taxValue, status, requestDate, country
// Assuming 'countries' endpoint returns objects with: id, name

export default function BasicTable() {
  const [rows, setRows] = useState([]);
  const [countries, setCountries] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const filterRef = useRef(null);
  const navigate = useNavigate();

  /* CLOSE FILTER WHEN CLICKING OUTSIDE */
  useEffect(() => {
    function handleClickOutside(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* FETCH DATA */
  useEffect(() => {
    async function load() {
      try {
        // Fetch taxes data
        const taxesRes = await fetch("https://685013d7e7c42cfd17974a33.mockapi.io/taxes");
        const taxesData = await taxesRes.json();

        // Fetch countries data
        const countriesRes = await fetch("https://685013d7e7c42cfd17974a33.mockapi.io/countries");
        const countryData = await countriesRes.json();

        setRows(taxesData);
        setCountries(countryData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    load();
  }, []);

  /* TABLE COLUMNS */
  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.accessor("entity", {
        header: "Entity Name", // Changed from 'entity'
        cell: (info) => info.getValue(),
      }),

      columnHelper.accessor("taxValue", { // Updated to use 'taxValue'
        header: "Tax Value",
        cell: (info) => `$${info.getValue()}`, // Formatting as currency
      }),

      columnHelper.accessor("status", { // Added 'status' column
        header: "Status",
        cell: (info) => info.getValue(),
      }),
      
      columnHelper.accessor("requestDate", {
        header: "Request Date",
        cell: (info) => {
          const date = info.getValue();
          if (!date) return "-";
          return new Date(date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        },
      }),

      columnHelper.accessor("country", {
        header: "Country",
        cell: (info) => info.getValue(),
      }),

      /* FILTER + EDIT COLUMN */
      {
        header: () => (
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            // Remove onMouseEnter/onMouseLeave to prevent accidental activation
            // onMouseEnter={() => setShowFilter(true)}
            // onMouseLeave={() => setShowFilter(false)}
          >
            <span
              style={{
                cursor: "pointer",
                fontSize: "20px",
                fontWeight: "bold",
                padding: "6px 10px",
                borderRadius: "8px",
                background: "rgba(0,0,0,0.05)",
                transition: "0.3s",
              }}
              onClick={() => setShowFilter(!showFilter)}
            >
              ⚲
            </span>

            {showFilter && (
              <div
                ref={filterRef}
                style={{
                  position: "absolute",
                  top: "45px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "white",
                  border: "1px solid #ddd",
                  padding: "12px",
                  borderRadius: "10px",
                  zIndex: 999,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  width: "160px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                {/* Assuming country objects have a 'name' property for display */}
                {countries.map((c) => (
                  <label
                    key={c.id}
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    {/* The checkbox functionality for filtering is not implemented here */}
                    <input type="checkbox" /> {c.name} 
                  </label>
                ))}
              </div>
            )}
          </div>
        ),
        accessorKey: "actions", // Changed from 'filter' to 'actions' for clarity
        cell: ({ row }) => (
          <button
            style={{
              cursor: "pointer",
              border: "none",
              background: "transparent",
              fontSize: "20px",
              color: "#0d6efd",
              transition: "0.3s",
              fontWeight: "bold",
            }}
            onClick={() => navigate("/edit", { state: { data: row.original } })}
          >
            ✎
          </button>
        ),
      },
    ],
    [countries, showFilter, navigate] // Added 'navigate' to dependency array
  );

  /* INITIALIZE TABLE */
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  /* RENDER TABLE */
  return (
    <div
      style={{
        padding: "40px",
        background: "#f4f7fb",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          fontSize: "26px",
          fontWeight: "700",
          textAlign: "center",
          color: "#333",
        }}
      >
        Customer Records
      </h2>

      {/* Conditional rendering for loading state */}
      {rows.length === 0 ? (
        <p style={{ textAlign: "center", padding: "20px", fontSize: "18px" }}>Loading data...</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "0",
            background: "white",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
          }}
        >
          <thead
            style={{
              background: "#e9eef7",
              color: "#333",
              fontWeight: "600",
              textTransform: "uppercase",
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      padding: "16px",
                      fontSize: "14px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                style={{
                  transition: "0.2s",
                  cursor: "pointer",
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      padding: "14px",
                      borderBottom: "1px solid #eee",
                      fontSize: "14px",
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}