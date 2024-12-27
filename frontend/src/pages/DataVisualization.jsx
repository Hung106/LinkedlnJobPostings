import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Menu, MenuItem, Box, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "../styles/DataVisualization.css"; 

// Import ảnh biểu đồ
import worktypeChart from "../assets/worktype.png";
import salaryChart from "../assets/salary.png";

const DataVisualization = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentChart, setCurrentChart] = useState("worktype"); 
  const menuItems = ["Dashboard", "Data Visualization", "Job", "Company", "Posting"];
  const routes = ["/", "/datavisualization", "/job", "/company", "/posting"];

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNextChart = () => {
    setCurrentChart((prev) => (prev === "worktype" ? "salary" : "worktype"));
  };

  const handlePreviousChart = () => {
    setCurrentChart((prev) => (prev === "salary" ? "worktype" : "salary"));
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
    } 
  };

  return (
    <div className="data-visualization">
      <Navbar
        title="LinkedlnJobPosting"
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
      </Menu>

      <Typography variant="h4" className="data-visualization-title">
        Data Visualization Page
      </Typography>
      <Typography variant="subtitle1" className="data-visualization-subtitle">
        {currentChart === "worktype" ? "Chart 1/2" : "Chart 2/2"}
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
