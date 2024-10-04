import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const EditDialog = ({
  editDialogOpen,
  selectedRow,
  handleClose,
  handleSaveUpdate,
  handleChangeRow,
}) => {
  return (
    <Dialog open={editDialogOpen} onClose={handleClose}>
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
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSaveUpdate} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(EditDialog);
