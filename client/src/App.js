import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Button,
  TextField,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Paper,
  Snackbar,
  IconButton,
  TablePagination,
  TableContainer,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null); // For updating

  useEffect(() => {
    fetchData();
  }, [search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const encodedSearch = encodeURIComponent(search.trim());
      const response = await fetch(
        `http://localhost:3000/api/files/data?search=${encodedSearch}`,
      );
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("http://localhost:3000/api/files/upload", {
        method: "POST",
        body: formData,
      });
      const responseData = await response.text();
      setSnackbarMessage("File uploaded successfully!");
      fetchData();
    } catch (error) {
      setSnackbarMessage("Error uploading file");
    }
    setUploading(false);
    setSnackbarOpen(true);
  };

  const handleDelete = async (filename) => {
    try {
      await fetch(`http://localhost:3000/api/files/delete/${filename}`, {
        method: "DELETE",
      });
      setSnackbarMessage("File deleted successfully!");
      fetchData();
    } catch (error) {
      setSnackbarMessage("Error deleting file");
    }
    setSnackbarOpen(true);
  };

  const handleUpdate = (file, row) => {
    setSelectedRow({ ...row, filename: file.filename });
    setEditDialogOpen(true);
  };

  const handleSaveUpdate = async () => {
    const { filename, SNo, ...updatedRow } = selectedRow;
    try {
      await fetch(`http://localhost:3000/api/files/update/${filename}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ SNo, updatedRow }),
      });
      setSnackbarMessage("Row updated successfully!");
      setEditDialogOpen(false);
      fetchData();
    } catch (error) {
      setSnackbarMessage("Error updating row");
    }
    setSnackbarOpen(true);
  };

  const handleChangeRow = (field, value) => {
    setSelectedRow((prev) => ({ ...prev, [field]: value }));
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp || isNaN(new Date(timestamp).getTime())) {
      return "Unknown date";
    }
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit", // Compact month format
      day: "2-digit", // Compact day format
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // AM/PM format
    }).format(date);
  };

  return (
    <Container>
      <Box my={4} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Excel Data Upload and Dashboard
        </Typography>

        {/* File Upload */}
        <Box display="flex" justifyContent="center" mb={2}>
          <input
            accept=".xlsx,.xls"
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              component="span"
              color="primary"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Choose File"}
            </Button>
          </label>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleUpload}
            disabled={!file || uploading}
            style={{ marginLeft: "10px" }}
          >
            {uploading ? <CircularProgress size={24} /> : "Upload"}
          </Button>
        </Box>

        {/* Search Bar */}
        <Box display="flex" justifyContent="center" mb={4}>
          <TextField
            label="Search by Filename"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            style={{ maxWidth: 400 }}
          />
        </Box>

        {/* Data Table */}
        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <Paper elevation={3}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Filename</TableCell>
                    <TableCell>Date Uploaded</TableCell>
                    <TableCell>Details</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.length === 0 ? (
                    <Typography>No data available</Typography>
                  ) : (
                    data
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                      .map((file, index) => (
                        <TableRow key={index}>
                          <TableCell>{file.filename}</TableCell>
                          <TableCell
                            style={{ fontSize: "0.85rem", padding: "6px" }}
                          >
                            {formatDateTime(file.timestamp)}
                          </TableCell>

                          <TableCell>
                            {file.data.map((row, rowIndex) => (
                              <Grid
                                container
                                spacing={2}
                                key={rowIndex}
                                style={{
                                  border: "1px solid #ddd",
                                  marginBottom: "10px",
                                  padding: "10px",
                                  borderRadius: "5px",
                                }}
                              >
                                <Grid item xs={2}>
                                  <Typography variant="body1">
                                    <strong>SNo:</strong> {row.SNo}
                                  </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                  <Typography variant="body1">
                                    <strong>Material:</strong> {row.Material}
                                  </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                  <Typography variant="body1">
                                    <strong>Unit:</strong> {row.Unit}
                                  </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                  <Typography variant="body1">
                                    <strong>Quantity:</strong> {row.Quantity}
                                  </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                  <Typography variant="body1">
                                    <strong>Rate:</strong> {row.Rate}
                                  </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                  <Typography variant="body1">
                                    <strong>Amount:</strong> {row.Amount}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => handleUpdate(file, row)}
                                  >
                                    Edit
                                  </Button>
                                </Grid>
                              </Grid>
                            ))}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={() => handleDelete(file.filename)}
                            >
                              Delete File
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) =>
                setRowsPerPage(parseInt(e.target.value, 10))
              }
            />
          </Paper>
        )}

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setSnackbarOpen(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit Row</DialogTitle>
          <DialogContent>
            <TextField
              label="SNo"
              fullWidth
              value={selectedRow?.SNo || ""}
              onChange={(e) => handleChangeRow("SNo", e.target.value)}
            />
            <TextField
              label="Material"
              fullWidth
              value={selectedRow?.Material || ""}
              onChange={(e) => handleChangeRow("Material", e.target.value)}
            />
            <TextField
              label="Unit"
              fullWidth
              value={selectedRow?.Unit || ""}
              onChange={(e) => handleChangeRow("Unit", e.target.value)}
            />
            <TextField
              label="Quantity"
              fullWidth
              value={selectedRow?.Quantity || ""}
              onChange={(e) => handleChangeRow("Quantity", e.target.value)}
            />
            <TextField
              label="Rate"
              fullWidth
              value={selectedRow?.Rate || ""}
              onChange={(e) => handleChangeRow("Rate", e.target.value)}
            />
            <TextField
              label="Amount"
              fullWidth
              value={selectedRow?.Amount || ""}
              onChange={(e) => handleChangeRow("Amount", e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSaveUpdate} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default App;
