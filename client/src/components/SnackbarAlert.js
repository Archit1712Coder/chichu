import React from "react";
import { Snackbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const SnackbarAlert = ({ snackbarOpen, snackbarMessage, handleClose }) => {
  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={handleClose}
      message={snackbarMessage}
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
};

export default React.memo(SnackbarAlert);
