import React, { useState, useEffect } from "react";
import { Snackbar, Alert, Button } from "@mui/material";

const App = () => {
  
  const [clients, setClients] = useState([
    {
      clientName: "Client A",
      materials: [
        { materialName: "Cement", initialRate: 50, finalRate: 55 },
        { materialName: "Steel", initialRate: 80, finalRate: 80 },
      ],
    },
    {
      clientName: "Client B",
      materials: [
        { materialName: "Wood", initialRate: 30, finalRate: 40 },
        { materialName: "Bricks", initialRate: 20, finalRate: 25 },
      ],
    },
  ]);

  const [discrepancies, setDiscrepancies] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    detectDiscrepancies();
  }, [clients]);

  
  const detectDiscrepancies = () => {
    const foundDiscrepancies = [];

    clients.forEach((client) => {
      client.materials.forEach((material) => {
        if (material.initialRate !== material.finalRate) {
          foundDiscrepancies.push({
            clientName: client.clientName,
            materialName: material.materialName,
            initialRate: material.initialRate,
            finalRate: material.finalRate,
          });
        }
      });
    });

    setDiscrepancies(foundDiscrepancies);
    if (foundDiscrepancies.length > 0) {
      setOpenSnackbar(true);
    }
  };

  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Client Rate Discrepancy Dashboard</h1>

      {/* Button to manually trigger discrepancy detection */}
      <Button variant="contained" onClick={detectDiscrepancies}>
        Check for Rate Discrepancies
      </Button>

      {/* Display Discrepancies */}
      <div style={{ marginTop: "20px" }}>
        {discrepancies.length > 0 ? (
          <div>
            <h3>Discrepancies Found:</h3>
            {discrepancies.map((discrepancy, index) => (
              <div key={index} style={{ padding: "10px", border: "1px solid #ccc", marginBottom: "10px", borderRadius: "5px" }}>
                <p>
                  <strong>Client:</strong> {discrepancy.clientName}
                </p>
                <p>
                  <strong>Material:</strong> {discrepancy.materialName}
                </p>
                <p>
                  <strong>Initial Rate:</strong> {discrepancy.initialRate}
                </p>
                <p>
                  <strong>Final Rate:</strong> {discrepancy.finalRate}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No rate discrepancies found.</p>
        )}
      </div>

      {/* Snackbar Notification for Rate Discrepancies */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="warning" sx={{ width: "100%" }}>
          {discrepancies.length} rate discrepancy{discrepancies.length > 1 ? "ies" : "y"} found!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default App;

