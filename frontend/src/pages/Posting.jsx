import React, { useState } from "react";
import Navbar from "../components/Navbar";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Typography,
} from "@mui/material";
import "../styles/Posting.css";
import BKLOGO from "../assets/BKLOGO.png";

const Posting = () => {
  const menuItems = ["Dashboard", "Data visualization", "Job", "Company", "Posting"];
  const routes = ["/", "/datavisualization", "/job", "/company", "/posting"];

  const [isAdditionalInfoVisible, setAdditionalInfoVisible] = useState(false);
  const [isPostingStateVisible, setPostingStateVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data
  const postings = Array.from({ length: 200 }).map((_, index) => ({
    postingID: `P-${index + 1}`,
    title: `Title ${index + 1}`,
    description: `Description ${index + 1}`,
    jobPostingURL: `https://example.com/job/${index + 1}`,
    applicationType: index % 2 === 0 ? "Full-Time" : "Part-Time",
    skillsDescription: `Skill ${index + 1}`,
    workType: index % 3 === 0 ? "Remote" : "On-site",
    zipCode: `1000${index % 10}`,
    remoteAllowed: index % 2 === 0 ? "Yes" : "No",
    location: `Location ${index + 1}`,
    listedTime: `2024-12-2${index % 10}`,
    applies: Math.floor(Math.random() * 100),
    views: Math.floor(Math.random() * 500),
    expiring: `2025-01-0${index % 10}`,
    originalListedTime: `2024-12-01`,
    timezoneOffset: index % 10,
    applyRate: `${Math.random().toFixed(2)}`,
    remainingTime: `${Math.floor(Math.random() * 24)} hours`,
    closeTime: `2025-01-0${index % 10}`,
    applicationURL: `https://example.com/apply/${index + 1}`,
    postingDomain: "example.com",
    experienceLevel: index % 2 === 0 ? "Junior" : "Senior",
  }));

  const totalPages = Math.ceil(postings.length / itemsPerPage);

  // Toggle visibility of tables
  const toggleTable = (tableName) => {
    switch (tableName) {
      case "additionalInfo":
        setAdditionalInfoVisible(!isAdditionalInfoVisible);
        setPostingStateVisible(false);
        break;
      case "postingState":
        setPostingStateVisible(!isPostingStateVisible);
        setAdditionalInfoVisible(false);
        break;
      default:
        break;
    }
  };



  

  // Pagination
  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (direction === "prev" && prev > 1) return prev - 1;
      if (direction === "next" && prev < totalPages) return prev + 1;
      return prev;
    });
  };

  // Current data for the main posting table
  const currentPostings = postings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Data for additional info table
  const getAdditionalInfoData = () =>
    currentPostings.map((posting) => ({
      additionalInfoID: posting.postingID,
      closeTime: posting.closeTime,
      applicationURL: posting.applicationURL,
      postingDomain: posting.postingDomain,
      experienceLevel: posting.experienceLevel,
    }));

  // Data for posting state table
  const getPostingStateData = () =>
    currentPostings.map((posting) => ({
      postingStateID: posting.postingID,
      listedTime: posting.listedTime,
      applies: posting.applies,
      views: posting.views,
      expiry: posting.expiring,
      originalListedTime: posting.originalListedTime,
      timezoneOffset: posting.timezoneOffset,
      applyRate: posting.applyRate,
      remainingTime: posting.remainingTime,
    }));

  return (
   
    <div className="posting-container">
      {/* Navbar */}
      <Navbar
        title="LinkedlnJobPosting"
        menuItems={menuItems}
        routes={routes}
        active="Posting"
      />

      {/* Header Section */}
      <div className="posting-header">
      <div className="posting-header">
          <Typography variant="h4" gutterBottom>
            POSTING
          </Typography>
          <div className="bird" style={{ left: '10%', top: '10%' }}>
              <img src={BKLOGO} alt="Logo" style={{ width: '150%' }} />
            </div>
            <div className="bird" style={{ left: '50%', top: '20%' }}>
              <img src={BKLOGO} alt="Chim" style={{ width: '250%' }} />
            </div>
            <div className="bird" style={{ left: '80%', top: '15%' }}>
              <img src={BKLOGO} alt="Chim" style={{ width: '350%' }} />
            </div>
        </div>
        <div className="button-container">
          <Button
            variant="contained"
            onClick={() => toggleTable("additionalInfo")}
            style={{ marginRight: "10px" }}
          >
            Additional Info
          </Button>
          <Button variant="contained" onClick={() => toggleTable("postingState")}>
            Posting State
          </Button>
        </div>
      </div>

      {/* Main Posting Table */}
      <Table className="posting-table">
        <TableHead>
          <TableRow>
            {[
              "postingID",
              "title",
              "description",
              "jobPostingURL",
              "applicationType",
              "skillsDescription",
              "workType",
              "zipCode",
              "remoteAllowed",
              "location",
              "listedTime",
              "applies",
              "views",
              "expiring",
              "originalListedTime",
              "timezoneOffset",
              "applyRate",
              "remainingTime",
              "closeTime",
              "applicationURL",
              "postingDomain",
              "experienceLevel",
            ].map((key) => (
              <TableCell key={key}>{key}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPostings.map((posting, index) => (
            <TableRow key={index}>
              {Object.keys(posting).map((key, idx) => (
                <TableCell key={idx}>{posting[key]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Additional Info Table */}
      {isAdditionalInfoVisible && (
        <Table className="additional-info-table">
          <TableHead>
            <TableRow>
              <TableCell>Additional Info ID</TableCell>
              <TableCell>Close Time</TableCell>
              <TableCell>Application URL</TableCell>
              <TableCell>Posting Domain</TableCell>
              <TableCell>Experience Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getAdditionalInfoData().map((info, index) => (
              <TableRow key={index}>
                <TableCell>{info.additionalInfoID}</TableCell>
                <TableCell>{info.closeTime}</TableCell>
                <TableCell>{info.applicationURL}</TableCell>
                <TableCell>{info.postingDomain}</TableCell>
                <TableCell>{info.experienceLevel}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Posting State Table */}
      {isPostingStateVisible && (
        <Table className="posting-state-table">
          <TableHead>
            <TableRow>
              <TableCell>Posting State ID</TableCell>
              <TableCell>Listed Time</TableCell>
              <TableCell>Applies</TableCell>
              <TableCell>Views</TableCell>
              <TableCell>Expiry</TableCell>
              <TableCell>Original Listed Time</TableCell>
              <TableCell>Timezone Offset</TableCell>
              <TableCell>Apply Rate</TableCell>
              <TableCell>Remaining Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getPostingStateData().map((state, index) => (
              <TableRow key={index}>
                <TableCell>{state.postingStateID}</TableCell>
                <TableCell>{state.listedTime}</TableCell>
                <TableCell>{state.applies}</TableCell>
                <TableCell>{state.views}</TableCell>
                <TableCell>{state.expiry}</TableCell>
                <TableCell>{state.originalListedTime}</TableCell>
                <TableCell>{state.timezoneOffset}</TableCell>
                <TableCell>{state.applyRate}</TableCell>
                <TableCell>{state.remainingTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Pagination */}
      <div className="pagination">
        <Button
          variant="contained"
          disabled={currentPage === 1}
          onClick={() => handlePageChange("prev")}
        >
          Previous
        </Button>
        <Typography variant="body1" style={{ margin: "0 10px", display: "inline-block" }}>
          Page {currentPage} of {totalPages}
        </Typography>
        <Button
          variant="contained"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange("next")}
        >
          Next
        </Button>
      </div>
    </div>
  
  );
};

export default Posting;
