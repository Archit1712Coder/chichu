import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import { formatDateTime, formatChange } from "../utils/formatters";

const DataTable = ({ data, page, rowsPerPage, handleDelete, handleUpdate }) => {
  return (
    <TableContainer component={Paper}>
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
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((file, index) => (
                <TableRow key={index}>
                  <TableCell>{file.filename}</TableCell>
                  <TableCell>{formatDateTime(file.timestamp)}</TableCell>
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
                            <strong>Quantity:</strong> {row.Quantity}{" "}
                            {formatChange(row.QuantityChange)}
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="body1">
                            <strong>Rate:</strong> {row.Rate}{" "}
                            {formatChange(row.RateChange)}
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="body1">
                            <strong>Amount:</strong> {row.Amount}{" "}
                            {formatChange(row.AmountChange)}
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
  );
};

export default React.memo(DataTable);
