import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Navbar from "../components/Navbar";

const Company = () => {
  const menuItems = ["Dashboard", "Data visualization", "Job", "Company", "Posting"];
  const routes = ["/", "/datavisualization", "/job", "/company", "/posting"];
  const [companies, setCompanies] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    industry: "",
    location: "",
    speciality: "",
    employee_count: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch companies on load
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch("/company");
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/company/${id}`, { method: "DELETE" });
      setCompanies(companies.filter((company) => company.id !== id));
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  const handleOpenDialog = (company) => {
    if (company) {
      setFormData({
        id: company.id,
        name: company.name,
        industry: company.industry,
        location: company.location,
        speciality: company.speciality,
        employee_count: company.employee_count,
      });
      setIsEditing(true);
    } else {
      setFormData({
        id: "",
        name: "",
        industry: "",
        location: "",
        speciality: "",
        employee_count: "",
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await fetch(`/company/${formData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch("/company", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }
      fetchCompanies();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving company:", error);
    }
  };

  return (
    <>
      <Navbar
        title="LinkedlnJobPosting"
        menuItems={menuItems}
        routes={routes}
        active="Company"
      />
      <Box sx={{ padding: "20px" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog(null)}
          sx={{ marginBottom: "20px" }}
        >
          Add Company
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Industry</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Speciality</TableCell>
                <TableCell>Employee Count</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>{company.id}</TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.industry}</TableCell>
                  <TableCell>{company.location}</TableCell>
                  <TableCell>{company.speciality}</TableCell>
                  <TableCell>{company.employee_count}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(company)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(company.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            {isEditing ? "Edit Company" : "Add Company"}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              fullWidth
              label="Industry"
              name="industry"
              value={formData.industry}
              onChange={handleFormChange}
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleFormChange}
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              fullWidth
              label="Speciality"
              name="speciality"
              value={formData.speciality}
              onChange={handleFormChange}
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              fullWidth
              label="Employee Count"
              name="employee_count"
              value={formData.employee_count}
              onChange={handleFormChange}
              sx={{ marginBottom: "10px" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default Company;
