import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Menu, MenuItem, Box, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "../styles/DataVisualization.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import worktypeChart from "../assets/worktype.png";
import salaryChart from "../assets/salary.png";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const DataVisualization = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentChart, setCurrentChart] = useState("worktype"); // Default to the first chart
  const [keywordsData, setKeywordsData] = useState([]);
  const [jobTitleData, setJobTitleData] = useState(null);
  const [location, setLocation] = useState("United States");
  const [companyData, setCompanyData] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [companyChartData, setCompanyChartData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/posting_title")
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setKeywordsData(result.data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    async function fetchJobTitleData() {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/v1/job_title_frequency_by_location?location=${location}`
        );
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const titles = data.map((item) => item.title);
          const frequencies = data.map((item) => item.frequency);

          setJobTitleData({
            labels: titles,
            datasets: [
              {
                label: "Frequency",
                data: frequencies,
                backgroundColor: [
                  "#ff6384",
                  "#36a2eb",
                  "#ffce56",
                  "#4bc0c0",
                  "#9966ff",
                  "#ff9f40",
                  "#66ff66",
                  "#ff9999",
                  "#66ccff",
                  "#c0c0c0",
                ],
                borderWidth: 1,
              },
            ],
          });
        } else {
          setJobTitleData(null);
        }
      } catch (error) {
        console.error("Error fetching job titles:", error);
      }
    }

    fetchJobTitleData();
  }, [location]);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/company");
        const data = await response.json();
        setCompanyData(data.data);

        if (data.data.length > 0) {
          setSelectedCompanyId(data.data[0].company_id);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    }

    fetchCompanies();
  }, []);

  const renderCompanyTable = () => {
    if (!companyData || companyData.length === 0) {
      return <Typography>No companies available</Typography>;
    }
  
    return (
      <table>
        <thead>
          <tr>
            <th>Company ID</th>
            <th>Company Name</th>
          </tr>
        </thead>
        <tbody>
          {companyData.map((company) => (
            <tr key={company.company_id}>
              <td>{company.company_id}</td>
              <td>{company.company_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  useEffect(() => {
    if (selectedCompanyId) {
      async function fetchCompanyChartData() {
        try {
          const response = await fetch(
            `http://127.0.0.1:5000/api/company/chart_company_postings/${selectedCompanyId}`
          );
          const data = await response.json();
          const days = data.data.map((item) => item.original_listed_time);
          const postCounts = data.data.map((item) => item.post_count);

          setCompanyChartData({
            labels: days,
            datasets: [
              {
                label: "Số lượng bài đăng",
                data: postCounts,
                borderColor: "blue",
                backgroundColor: "rgba(0, 123, 255, 0.3)",
                pointRadius: 5,
                pointHoverRadius: 8,
              },
            ],
          });
        } catch (error) {
          console.error("Error fetching company chart data:", error);
        }
      }

      fetchCompanyChartData();
    }
  }, [selectedCompanyId]);

  const menuItems = ["Dashboard", "Data Visualization", "Job", "Company", "Posting"];
  const routes = ["/", "/datavisualization", "/job", "/company", "/posting"];

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNextChart = () => {
    setCurrentChart((prev) => {
      if (prev === "worktype") return "salary";
      if (prev === "salary") return "keywords";
      if (prev === "keywords") return "jobTitle";
      if (prev === "jobTitle") return "companyPostings";
      return "worktype";
    });
  };

  const handlePreviousChart = () => {
    setCurrentChart((prev) => {
      if (prev === "companyPostings") return "jobTitle";
      if (prev === "jobTitle") return "keywords";
      if (prev === "keywords") return "salary";
      if (prev === "salary") return "worktype";
      return "companyPostings";
    });
  };

  const renderChart = () => {
    if (currentChart === "worktype") {
      return (
        <div className="chart-container">
          <Typography variant="h5" className="data-visualization-title">
            Worktype Distribution
          </Typography>
          <img src={worktypeChart} alt="Worktype Chart" className="chart-image" />
          <Typography variant="body2" className="chart-description">
            This chart illustrates the distribution of different work types such as Full-time, Part-time, and Contract.
          </Typography>
        </div>
      );
    } else if (currentChart === "salary") {
      return (
        <div className="chart-container">
          <Typography variant="h5" className="data-visualization-title">
            Salary Distribution by Pay Period
          </Typography>
          <img src={salaryChart} alt="Salary Chart" className="chart-image" />
          <Typography variant="body2" className="chart-description">
            This chart shows salary distribution based on payment periods like Hourly, Weekly, and Monthly.
          </Typography>
        </div>
      );
    } else if (currentChart === "keywords") {
      return (
        <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px" }}>
          <Typography variant="h5" className="data-visualization-title" style={{ textAlign: "center", color: "green" }}>
            TOP 15 từ khóa xuất hiện nhiều nhất trong Posting title
          </Typography>
          <div style={{ padding: "10px", maxWidth: "600px", margin: "0 auto" }}>
            {keywordsData.map(([keyword, count], index) => (
              <div
                key={index}
                style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}
              >
                <span
                  style={{ width: "150px", fontWeight: "bold", textAlign: "left", fontSize: "25px" }}
                >
                  {keyword.charAt(0).toUpperCase() + keyword.slice(1)}
                </span>
                <div
                  style={{
                    width: `${(count / keywordsData[0][1]) * 100}%`,
                    backgroundColor: "#90d890",
                    color: "#000",
                    textAlign: "right",
                    padding: "5px",
                    borderRadius: "4px",
                  }}
                >
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (currentChart === "jobTitle") {
      return (
        <div className="chart-container">
          <Typography variant="h5" className="data-visualization-title">
            Job Title Frequency in {location}
          </Typography>
          {jobTitleData ? (
            <Bar
              data={jobTitleData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: `Job Title Frequency in ${location}` },
                },
                scales: {
                  x: { title: { display: true, text: "Job Titles" } },
                  y: { title: { display: true, text: "Frequency" }, beginAtZero: true },
                },
              }}
            />
          ) : (
            <Typography>Loading chart data...</Typography>
          )}
        </div>
      );
    } else if (currentChart === "companyPostings" && renderCompanyTable()) {
      return (
        <div className="chart-container">
          <Typography variant="h5" className="data-visualization-title">
            Số lượng bài đăng theo ngày của công ty
          </Typography>
          {companyChartData ? (
            <Line
              data={companyChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: "Số lượng bài đăng theo ngày" },
                },
                scales: {
                  x: { title: { display: true, text: "Ngày" } },
                  y: { title: { display: true, text: "Số lượng bài đăng" }, beginAtZero: true },
                },
              }}
            />
          ) : (
            <Typography>Loading chart data...</Typography>
          )}
        </div>
      );
    }
  };

  return (
    <div className="data-visualization">
      <Navbar
        title="LinkedIn Job Posting"
        menuItems={menuItems}
        routes={routes}
        active="Data Visualization"
        showMenuIcon={true}
        onMenuClick={handleMenuClick}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        MenuListProps={{ "aria-labelledby": "menu-button" }}
      >
        <MenuItem
          onClick={() => {
            setCurrentChart("worktype");
            handleMenuClose();
          }}
        >
          Chart 1: Worktype
        </MenuItem>
        <MenuItem
          onClick={() => {
            setCurrentChart("salary");
            handleMenuClose();
          }}
        >
          Chart 2: Salary
        </MenuItem>
        <MenuItem
          onClick={() => {
            setCurrentChart("keywords");
            handleMenuClose();
          }}
        >
          Chart 3: Keywords
        </MenuItem>
        <MenuItem
          onClick={() => {
            setCurrentChart("jobTitle");
            handleMenuClose();
          }}
        >
          Chart 4: Job Title
        </MenuItem>
        <MenuItem
          onClick={() => {
            setCurrentChart("companyPostings");
            handleMenuClose();
          }}
        >
          Chart 5: Company Postings
        </MenuItem>
      </Menu>

      <Typography variant="h4" className="data-visualization-title">
        Data Visualization Page
      </Typography>
      <Typography variant="subtitle1" className="data-visualization-subtitle">
        {currentChart === "worktype"
          ? "Chart 1/5"
          : currentChart === "salary"
          ? "Chart 2/5"
          : currentChart === "keywords"
          ? "Chart 3/5"
          : currentChart === "jobTitle"
          ? "Chart 4/5"
          : "Chart 5/5"}
      </Typography>
      <TransitionGroup>
        <CSSTransition key={currentChart} classNames="fade" timeout={300}>
          {renderChart()}
        </CSSTransition>
      </TransitionGroup>
      <div className="button-container">
        <Button
          startIcon={<ArrowBackIcon />}
          className="button button-primary"
          onClick={handlePreviousChart}
        >
          Quay lại
        </Button>
        <Button
          endIcon={<ArrowForwardIcon />}
          className="button button-success"
          onClick={handleNextChart}
        >
          Tiếp theo
        </Button>
      </div>
    </div>
  );
};

export default DataVisualization;
