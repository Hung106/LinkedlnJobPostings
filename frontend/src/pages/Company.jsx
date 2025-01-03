import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Button, TextField } from '@mui/material';
import Navbar from "../components/Navbar";

const Company = () => {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState({});
  const [locationData, setLocationData] = useState({});
  const [showDescriptions, setShowDescriptions] = useState({});
  const [industryData, setIndustryData] = useState({});
  const [specialityData, setSpecialityData] = useState({});
  const [newCompany, setNewCompany] = useState({
    company_id: '',
    name: '',
    company_size: '',
    url: '',
    description: '',
  });
  const [editingCompany, setEditingCompany] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const menuItems = ["Dashboard", "Data Visualization", "Job", "Company", "Posting"];
  const routes = ["/", "/datavisualization", "/job", "/company", "/posting"];
  const cellStyle = {
    borderRight: '1px solid rgba(224, 224, 224, 1)', // Thêm vạch dọc
    textAlign: 'center',
  };
  const fetchCompanies = () => {
    setLoading(true); // Hiển thị trạng thái loading
    axios
      .get("http://127.0.0.1:5000/api/company/")
      .then((response) => {
        setCompanies(response.data.data); // Cập nhật danh sách công ty
        setLoading(false); // Dừng trạng thái loading
      })
      .catch((error) => {
        console.error("Failed to fetch company data", error);
        setError("Failed to fetch company data.");
        setLoading(false); // Dừng trạng thái loading nếu gặp lỗi
      });
  };
  const handleCreate = () => {
    if (
      !newCompany.company_id ||
      !newCompany.name ||
      !newCompany.company_size ||
      !newCompany.url ||
      !newCompany.description
    ) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }
  
    axios
      .post('http://127.0.0.1:5000/api/company/', newCompany, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(() => {
        setNewCompany({
          company_id: '',
          name: '',
          company_size: '',
          url: '',
          description: '',
        });
        setIsCreating(false);
        alert('Tạo công ty thành công.');
        fetchCompanies(); // Fetch the updated list of companies
      })
      .catch((error) => {
        console.error('Failed to create company:', error.response?.data || error.message);
        alert(`Lỗi khi tạo công ty: ${error.response?.data?.message || 'Không xác định'}`);
      });
  };  
  const handleUpdate = (companyId, updatedData) => {
    axios
      .put(`http://127.0.0.1:5000/api/company/${companyId}`, updatedData, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        alert(`Company ID ${companyId} updated successfully.`);
        setEditingCompany(null); // Đóng form chỉnh sửa
        fetchCompanies(); // Fetch lại danh sách công ty
      })
      .catch((error) => {
        console.error(`Failed to update company with ID ${companyId}`, error.response?.data || error.message);
        alert(`Failed to update company ID ${companyId}: ${error.response?.data?.message || "Unknown error."}`);
      });
  };


  const handleDelete = (companyId) => {
    if (!window.confirm(`Are you sure you want to delete company ID ${companyId}?`)) {
      return;
    }

    axios
      .delete(`http://127.0.0.1:5000/api/company/${companyId}`)
      .then(() => {
        alert(`Company ID ${companyId} deleted successfully.`);
        fetchCompanies(); // Fetch lại danh sách sau khi xóa
      })
      .catch((error) => {
        console.error(`Failed to delete company with ID ${companyId}`, error);
        alert(`Failed to delete company ID ${companyId}: ${error.response?.data?.message || "Unknown error."}`);
      });
  };

  useEffect(() => {

    // Fetch data từ API
    axios.get('http://127.0.0.1:5000/api/company/')
      .then((response) => {
        setCompanies(response.data.data); // Dữ liệu từ API
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to fetch company data');
        setLoading(false);
      });
  }, []);

  const toggleDescription = (companyId) => {
    setShowDescriptions((prev) => ({
      ...prev,
      [companyId]: !prev[companyId],
    }));
  };

  // Gọi API để lấy employee_count và follower_count khi bấm nút
  const fetchEmployeeData = (companyId) => {
    if (employeeData[companyId]) {
      setEmployeeData((prev) => ({
        ...prev,
        [companyId]: { ...prev[companyId], visible: !prev[companyId].visible },
      }));
      return;
    }

    axios
      .get(`http://127.0.0.1:5000/api/company/employee_count/${companyId}`)
      .then((response) => {
        setEmployeeData((prev) => ({
          ...prev,
          [companyId]: { data: response.data.data, visible: true },
        }));
      })
      .catch((error) => {
        console.error(`Failed to fetch employee data for company ${companyId}`, error);
        setEmployeeData((prev) => ({
          ...prev,
          [companyId]: { data: [], visible: true, error: 'Error fetching data' },
        }));
      });
  };

  // Gọi API lấy dữ liệu location
  const fetchLocationData = (companyId) => {
    if (locationData[companyId]) {
      setLocationData((prev) => ({
        ...prev,
        [companyId]: { ...prev[companyId], visible: !prev[companyId].visible },
      }));
      return;
    }

    axios
      .get(`http://127.0.0.1:5000/api/company/location/${companyId}`)
      .then((response) => {
        setLocationData((prev) => ({
          ...prev,
          [companyId]: { data: response.data.data, visible: true },
        }));
      })
      .catch((error) => {
        console.error(`Failed to fetch location data for company ${companyId}`, error);
        setLocationData((prev) => ({
          ...prev,
          [companyId]: { data: [], visible: true, error: 'Error fetching data' },
        }));
      });
  };
  // Gọi API lấy dữ liệu industry
  const fetchIndustryData = (companyId) => {
    if (industryData[companyId]) {
      setIndustryData((prev) => ({
        ...prev,
        [companyId]: { ...prev[companyId], visible: !prev[companyId].visible },
      }));
      return;
    }

    axios
      .get(`http://127.0.0.1:5000/api/company/industries/${companyId}`)
      .then((response) => {
        setIndustryData((prev) => ({
          ...prev,
          [companyId]: { data: response.data.data, visible: true },
        }));
      })
      .catch((error) => {
        console.error(`Failed to fetch industry data for company ${companyId}`, error);
        setIndustryData((prev) => ({
          ...prev,
          [companyId]: { data: [], visible: true, error: 'Error fetching data' },
        }));
      });
  };
  // Gọi API lấy dữ liệu speciality
  const fetchSpecialityData = (companyId) => {
    if (specialityData[companyId]) {
      setSpecialityData((prev) => ({
        ...prev,
        [companyId]: { ...prev[companyId], visible: !prev[companyId].visible },
      }));
      return;
    }

    axios
      .get(`http://127.0.0.1:5000/api/company/specialities/${companyId}`)
      .then((response) => {
        setSpecialityData((prev) => ({
          ...prev,
          [companyId]: { data: response.data.data, visible: true },
        }));
      })
      .catch((error) => {
        console.error(`Failed to fetch Specialities data for company ${companyId}`, error);
        setSpecialityData((prev) => ({
          ...prev,
          [companyId]: { data: [], visible: true, error: 'Error fetching data' },
        }));
      });
  };
  return (
    <>
      <Navbar
        title="LinkedlnJobPosting"
        menuItems={menuItems}
        routes={routes}
        active="Company"
      />
      <div style={{ padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Company List
        </Typography>
        {editingCompany && (
          <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <Typography variant="h6">Update Company</Typography>
            <TextField
              label="Name"
              fullWidth
              value={editingCompany.name}
              onChange={(e) => setEditingCompany({ ...editingCompany, name: e.target.value })}
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Company Size"
              fullWidth
              value={editingCompany.company_size}
              onChange={(e) => setEditingCompany({ ...editingCompany, company_size: e.target.value })}
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="URL"
              fullWidth
              value={editingCompany.url}
              onChange={(e) => setEditingCompany({ ...editingCompany, url: e.target.value })}
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={editingCompany.description}
              onChange={(e) => setEditingCompany({ ...editingCompany, description: e.target.value })}
              style={{ marginBottom: '10px' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleUpdate(editingCompany.company_id, editingCompany)}
              style={{ marginRight: '10px' }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setEditingCompany(null)} // Đóng form chỉnh sửa
            >
              Cancel
            </Button>
          </div>
        )}

        {isCreating ? (
          <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <Typography variant="h6">Create New Company</Typography>
            <TextField
              label="Company ID"
              fullWidth
              type="number" // Đặt loại input là số
              value={newCompany.company_id}
              onChange={(e) => setNewCompany({ ...newCompany, company_id: Number(e.target.value) || '' })}
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Name"
              fullWidth
              value={newCompany.name}
              onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Company Size"
              fullWidth
              value={newCompany.company_size}
              onChange={(e) => setNewCompany({ ...newCompany, company_size: e.target.value })}
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="URL"
              fullWidth
              value={newCompany.url}
              onChange={(e) => setNewCompany({ ...newCompany, url: e.target.value })}
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={newCompany.description}
              onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
              style={{ marginBottom: '10px' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreate}
              style={{ marginRight: '10px' }}
            >
              Create
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsCreating(true)}
            style={{ marginBottom: '20px' }}
          >
            New
          </Button>
        )}

        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && companies.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={cellStyle}><strong>ID</strong></TableCell>
                  <TableCell style={cellStyle}><strong>Name</strong></TableCell>
                  <TableCell style={cellStyle}><strong>Size</strong></TableCell>
                  <TableCell style={cellStyle}><strong>URL</strong></TableCell>
                  <TableCell style={cellStyle}><strong>Description</strong></TableCell>
                  <TableCell style={cellStyle}><strong>Employee Data</strong></TableCell>
                  <TableCell style={cellStyle}><strong>Location</strong></TableCell>
                  <TableCell style={cellStyle}><strong>Industry</strong></TableCell>
                  <TableCell style={cellStyle}><strong>Speciality</strong></TableCell>
                  <TableCell style={cellStyle}><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.company_id}>
                    <TableCell style={cellStyle}>{company.company_id}</TableCell>
                    <TableCell style={cellStyle}>{company.name}</TableCell>
                    <TableCell style={cellStyle}>{company.company_size}</TableCell>
                    <TableCell style={cellStyle}>
                      <a href={company.url} target="_blank" rel="noopener noreferrer">
                        {company.url}
                      </a>
                    </TableCell>
                    <TableCell style={cellStyle}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => toggleDescription(company.company_id)}
                      >
                        {showDescriptions[company.company_id] ? "Hide Description" : "Show Description"}
                      </Button>
                      {showDescriptions[company.company_id] && (
                        <Typography style={{ marginTop: '10px', whiteSpace: 'pre-line' }}>
                          {company.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell style={cellStyle}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => fetchEmployeeData(company.company_id)}
                      >
                        {employeeData[company.company_id]?.visible ? "Hide Employee Data" : "Show Employee Data"}
                      </Button>
                      {employeeData[company.company_id]?.visible && (
                        <div style={{ marginTop: '10px' }}>
                          {employeeData[company.company_id]?.error ? (
                            <Typography color="error">{employeeData[company.company_id].error}</Typography>
                          ) : (
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell style={cellStyle}><strong>Employee Count</strong></TableCell>
                                  <TableCell style={cellStyle}><strong>Follower Count</strong></TableCell>
                                  <TableCell style={cellStyle}><strong>Time Recorded</strong></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {employeeData[company.company_id]?.data.map((record, index) => (
                                  <TableRow key={index}>
                                    <TableCell style={cellStyle}>{record.employee_count}</TableCell>
                                    <TableCell style={cellStyle}>{record.follower_count}</TableCell>
                                    <TableCell style={cellStyle}>{record.time_recorded}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell style={cellStyle}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => fetchLocationData(company.company_id)}
                      >
                        {locationData[company.company_id]?.visible ? "Hide Location Data" : "Show Location Data"}
                      </Button>
                      {locationData[company.company_id]?.visible && (
                        <div style={{ marginTop: '10px' }}>
                          {locationData[company.company_id]?.error ? (
                            <Typography color="error">{locationData[company.company_id].error}</Typography>
                          ) : (
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell><strong>City</strong></TableCell>
                                  <TableCell><strong>Country</strong></TableCell>
                                  <TableCell><strong>Number</strong></TableCell>
                                  <TableCell><strong>State</strong></TableCell>
                                  <TableCell><strong>Street</strong></TableCell>
                                  <TableCell><strong>Zipcode</strong></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {locationData[company.company_id]?.data.map((record, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{record.city}</TableCell>
                                    <TableCell>{record.country}</TableCell>
                                    <TableCell>{record.number}</TableCell>
                                    <TableCell>{record.state}</TableCell>
                                    <TableCell>{record.street}</TableCell>
                                    <TableCell>{record.zipcode}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell style={cellStyle}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => fetchIndustryData(company.company_id)}
                      >
                        {industryData[company.company_id]?.visible ? "Hide Industry Data" : "Show Industry Data"}
                      </Button>
                      {industryData[company.company_id]?.visible && (
                        <div style={{ marginTop: '10px' }}>
                          {industryData[company.company_id]?.error ? (
                            <Typography color="error">{industryData[company.company_id].error}</Typography>
                          ) : (
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell><strong>Industry_id</strong></TableCell>
                                  <TableCell><strong>Name</strong></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {industryData[company.company_id]?.data.map((record, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{record.Industry_id}</TableCell>
                                    <TableCell>{record.Industry_name}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell style={cellStyle}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => fetchSpecialityData(company.company_id)}
                      >
                        {specialityData[company.company_id]?.visible ? "Hide speciality Data" : "Show speciality Data"}
                      </Button>
                      {specialityData[company.company_id]?.visible && (
                        <div style={{ marginTop: '10px' }}>
                          {specialityData[company.company_id]?.error ? (
                            <Typography color="error">{specialityData[company.company_id].error}</Typography>
                          ) : (
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell><strong>speciality_id</strong></TableCell>
                                  <TableCell><strong>Name</strong></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {specialityData[company.company_id]?.data.map((record, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{record.speciality_id}</TableCell>
                                    <TableCell>{record.speciality}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setEditingCompany(company)} // Hiển thị form chỉnh sửa với dữ liệu của công ty
                        style={{ marginRight: '10px' }}
                      >
                        Update
                      </Button>

                      <Button
                        variant="contained"
                        color="secondary"
                        style={{ marginRight: '10px' }}
                        onClick={() => handleDelete(company.company_id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          !loading && <Typography>No company data available.</Typography>
        )}
      </div>
    </>
  );
};

export default Company;
