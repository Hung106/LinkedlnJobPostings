import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Button } from '@mui/material';
import Navbar from "../components/Navbar";

const Company = () => {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState({});
  const [locationData, setLocationData] = useState({});
  const [showDescriptions, setShowDescriptions] = useState({});

  const menuItems = ["Dashboard", "Data Visualization", "Job", "Company", "Posting"];
  const routes = ["/", "/datavisualization", "/job", "/company", "/posting"];
  const cellStyle = {
    borderRight: '1px solid rgba(224, 224, 224, 1)', // Thêm vạch dọc
    textAlign: 'center',
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
                  <TableCell><strong>Location</strong></TableCell>
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
                                  <TableCell><strong>Employee Count</strong></TableCell>
                                  <TableCell><strong>Follower Count</strong></TableCell>
                                  <TableCell><strong>Time Recorded</strong></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {employeeData[company.company_id]?.data.map((record, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{record.employee_count}</TableCell>
                                    <TableCell>{record.follower_count}</TableCell>
                                    <TableCell>{record.time_recorded}</TableCell>
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
