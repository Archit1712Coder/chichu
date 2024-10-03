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
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import "./App.css";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: "#f5f5f5",
}));

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

      console.log("Fetched data:", result); // Log the fetched data for debugging
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/upload", {
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

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
                    <StyledTableCell>Filename</StyledTableCell>
                    <StyledTableCell>Details</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((fileItem, index) => (
                      <TableRow key={index}>
                        <TableCell>{fileItem.filename}</TableCell>
                        <TableCell>
                          {fileItem.data.map((row, rowIndex) => (
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
                                  <strong>Unit:</strong>{" "}
                                  {row.Unit ? row.Unit : "N/A"}
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
                            </Grid>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
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
      </Box>
    </Container>
  );
}

export default App;
