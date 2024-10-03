import React, { useState, useEffect } from "react";
import {
  Container, Box, Button, TextField, CircularProgress, Table, TableHead,
  TableRow, TableCell, TableBody, Typography, Paper, Snackbar, IconButton,
  TableSortLabel, Modal, TablePagination
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from '@mui/icons-material/Close';
import "./App.css";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: '#f5f5f5',
}));

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("clientname");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    fetchData();
  }, [search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/data?search=${search}`);
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

  const handleSortRequest = (property) => {
    const isAsc = sortBy === property && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(property);
  };

  const sortedData = (data) => {
    return [...data].sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClientClick = (client) => {
    setSelectedClient(client);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
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
            <Button variant="contained" component="span" color="primary" disabled={uploading}>
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
            label="Search by Client Name"
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
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>
                    <TableSortLabel
                      active={sortBy === "SNo"}
                      direction={sortOrder}
                      onClick={() => handleSortRequest("SNo")}
                    >
                      SNo
                    </TableSortLabel>
                  </StyledTableCell>
                  <StyledTableCell>Material</StyledTableCell>
                  <StyledTableCell>Unit</StyledTableCell>
                  <StyledTableCell>Quantity</StyledTableCell>
                  <StyledTableCell>Rate</StyledTableCell>
                  <StyledTableCell>Amount</StyledTableCell>
                  <StyledTableCell>
                    <TableSortLabel
                      active={sortBy === "clientname"}
                      direction={sortOrder}
                      onClick={() => handleSortRequest("clientname")}
                    >
                      Client Name
                    </TableSortLabel>
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData(data)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.SNo}</TableCell>
                      <TableCell>{item.Material}</TableCell>
                      <TableCell>{item.Unit}</TableCell>
                      <TableCell>{item.Quantity}</TableCell>
                      <TableCell>{item.Rate}</TableCell>
                      <TableCell>{item.Amount}</TableCell>
                      <TableCell
                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => handleClientClick(item)}
                      >
                        {item.clientname}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

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
            <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbarOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />

        {/* Modal for Client Details */}
        {selectedClient && (
          <Modal open={modalOpen} onClose={handleModalClose}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                outline: "none",
              }}
            >
              <Typography variant="h6">
                Client: {selectedClient.clientname}
              </Typography>
              <Typography>Material: {selectedClient.Material}</Typography>
              <Typography>Quantity: {selectedClient.Quantity}</Typography>
              <Typography>Rate: {selectedClient.Rate}</Typography>
              <Typography>Amount: {selectedClient.Amount}</Typography>
            </Box>
          </Modal>
        )}
      </Box>
    </Container>
  );
}

export default App;
