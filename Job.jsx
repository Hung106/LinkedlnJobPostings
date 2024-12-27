import React, { useState } from "react";
import Navbar from "../components/Navbar";
import {
  Table,
  Typography,
  Button,
} from "@mui/material";
import "../styles/Job.css";

const Job = () => {
  const menuItems = ["Dashboard", "Data visualization", "Job", "Company", "Posting"];
  const routes = ["/", "/datavisualization", "/job", "/company", "/posting"];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const jobs = Array.from({ length: 200 }).map((_, index) => ({
    id: 1999 + index,
    description: `Job ${index + 1}`,
    benefitInferred: false,
    benefitType: `Type ${index + 1}`,
    industry: `Industry ${index + 1}`,
    skill: `Skill ${index + 1}`,
    salaryType: "Med",
    salaryValue: 15 + index,
    currency: "USD",
    payPeriod: "Hourly",
  }));

  const benefits = Array.from({ length: 200 }).map((_, index) => ({
    id: index + 1,
    type: `Benefit ${index + 1}`,
    industry: `Industry ${index + 1}`,
  }));

  const totalPages = Math.ceil(jobs.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const currentJobs = jobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const currentBenefits = benefits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="job-page">
    <div className="container">
      {/* Header Section from Home */}
      <Navbar
        title="LinkedlnJobPosting"
        menuItems={menuItems}
        routes={routes}
        active="Job"
      />

      <div style={{ display: "flex", marginTop: "10px" }}>
        {/* Job Table */}
        <div style={{ flex: 2, marginRight: "20px" }}>
          <table className="job-table">
            <thead>
              <tr>
                <th colSpan="10" className="header">
                  JOB
                </th>
              </tr>
              <tr className="sub-header">
                <th rowSpan="2">Job id</th>
                <th rowSpan="2">Job description</th>
                <th colSpan="2">Benefit</th>
                <th rowSpan="2">Industry</th>
                <th rowSpan="2">Skill</th>
                <th colSpan="4">Salary</th>
              </tr>
              <tr className="sub-header">
                <th>Inferred</th>
                <th>Type</th>
                <th>Type</th>
                <th>Value</th>
                <th>Currency</th>
                <th>Pay period</th>
              </tr>
            </thead>
            <tbody>
              {currentJobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.id}</td>
                  <td>{job.description}</td>
                  <td className="checkbox-cell">
                    <input type="checkbox" checked={job.benefitInferred} readOnly />
                  </td>
                  <td>{job.benefitType}</td>
                  <td>{job.industry}</td>
                  <td>{job.skill}</td>
                  <td>{job.salaryType}</td>
                  <td>{job.salaryValue}</td>
                  <td>{job.currency}</td>
                  <td>{job.payPeriod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Benefit Table */}
        <div style={{ flex: 2 }}>
     <table className="benefit-table">
    <thead>
      <tr>
        <th colSpan="3" className="header">
          BENEFIT
        </th>
      </tr>
      <tr className="sub-header">
        <th>Benefit id</th>
        <th>Benefit type</th> {/* Benefit type moved here */}
      <th>Industry</th> 
      </tr>
    </thead>
    <tbody>
      {currentBenefits.map((benefit) => (
        <tr key={benefit.id}>
          <td>{benefit.id}</td>
          <td>{benefit.type}</td> {/* Benefit type displayed here */}
          <td>{benefit.industry}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      </div>

      {/* Pagination Buttons */}
      <div className="pagination">
      <Button
        variant="contained"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <Typography variant="body1" style={{ margin: "0 10px", display: "inline-block" }}>
        Page {currentPage} of {totalPages}
      </Typography>
      <Button
        variant="contained"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  </div>
  </div>
  );
};

export default Job;
