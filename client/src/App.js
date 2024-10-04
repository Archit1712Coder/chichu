import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Box,
  TextField,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import FileUpload from "./components/FileUpload";
import DataTable from "./components/DataTable";
import EditDialog from "./components/EditDialog";
import SnackbarAlert from "./components/SnackbarAlert";
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
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetchData();
  }, [search]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const encodedSearch = encodeURIComponent(search.trim());
      const response = await fetch(
        `http://localhost:3000/api/files/data?search=${encodedSearch}`,
      );
      if (!response.ok) throw new Error(response.statusText);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [search]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = useCallback(async () => {
    if (!file) return alert("Please select a file to upload");
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("http://localhost:3000/api/files/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error(response.statusText);
      setSnackbarMessage("File uploaded successfully!");
      fetchData();
    } catch (error) {
      setSnackbarMessage("Error uploading file");
    }
    setUploading(false);
    setSnackbarOpen(true);
  }, [file, fetchData]);

  const handleDelete = useCallback(
    async (filename) => {
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
    },
    [fetchData],
  );

  const handleUpdate = (file, row) => {
    setSelectedRow({ ...row, filename: file.filename });
    setEditDialogOpen(true);
  };

  const handleSaveUpdate = useCallback(async () => {
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
  }, [selectedRow, fetchData]);

  const handleChangeRow = (field, value) =>
    setSelectedRow((prev) => ({ ...prev, [field]: value }));

  return (
    <Container>
      <Box my={4} textAlign="center">
        <h1>Excel Data Upload and Dashboard</h1>
        <FileUpload
          uploading={uploading}
          handleFileChange={handleFileChange}
          handleUpload={handleUpload}
        />
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

        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <DataTable
            data={data}
            page={page}
            rowsPerPage={rowsPerPage}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
          />
        )}

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

        <EditDialog
          editDialogOpen={editDialogOpen}
          selectedRow={selectedRow}
          handleClose={() => setEditDialogOpen(false)}
          handleSaveUpdate={handleSaveUpdate}
          handleChangeRow={handleChangeRow}
        />

        <SnackbarAlert
          snackbarOpen={snackbarOpen}
          snackbarMessage={snackbarMessage}
          handleClose={() => setSnackbarOpen(false)}
        />
      </Box>
    </Container>
  );
}

export default App;
