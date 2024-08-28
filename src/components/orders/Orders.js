import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import ProjectStatusChip from "../projects/ProjectStatusChip";
import PaidIcon from "@mui/icons-material/Paid";
import PendingIcon from "@mui/icons-material/Pending";

const Orders = ({ orders }) => {
  return (
    <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
      <Table
        aria-label="orders table"
        sx={{
          borderTop: 1,
          borderColor: "#3237401A",
          minWidth: "1000px",
        }}
      >
        <TableHead>
          <TableRow
            sx={{
              fontWeight: "800",
              textTransform: "uppercase",
              borderColor: "#3237401A",
            }}
          >
            <TableCell>Project</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Total Amount</TableCell>
            <TableCell>First Payment</TableCell>
            <TableCell>Second Payment</TableCell>
            <TableCell>Date Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order._id}
              hover
              sx={{ cursor: "pointer", borderColor: "#3237401A" }}
            >
              <TableCell>{order.projectId.title}</TableCell>
              <TableCell>
                <ProjectStatusChip status={order.status} />
              </TableCell>
              <TableCell>${order.totalAmount}</TableCell>
              <TableCell>
                ${order.firstPayment.amount}
                {order.firstPayment.status === "Completed" ? (
                  <PaidIcon
                    fontSize="small"
                    sx={{ color: "#7C9A47", marginBottom: "4px" }}
                  />
                ) : (
                  <PendingIcon fontSize="small" sx={{ marginBottom: "4px" }} />
                )}
              </TableCell>
              <TableCell>
                ${order.secondPayment.amount}
                {order.secondPayment.status === "Completed" ? (
                  <PaidIcon
                    fontSize="small"
                    sx={{ color: "#7C9A47", marginBottom: "4px" }}
                  />
                ) : (
                  <PendingIcon fontSize="small" sx={{ marginBottom: "4px" }} />
                )}
              </TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Orders;
