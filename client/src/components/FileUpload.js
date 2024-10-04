import React from "react";
import { Button, CircularProgress, Box } from "@mui/material";

const FileUpload = ({ uploading, handleFileChange, handleUpload }) => {
  return (
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
        disabled={uploading}
        style={{ marginLeft: "10px" }}
      >
        {uploading ? <CircularProgress size={24} /> : "Upload"}
      </Button>
    </Box>
  );
};

export default React.memo(FileUpload);
