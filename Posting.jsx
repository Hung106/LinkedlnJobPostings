import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from 'axios';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Typography,
  TextField
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
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState([]);
  const [postingState, setPostingState] = useState([]);
  const [postingAdditionalInformation, setPostingAdditionalInformation] = useState([]);
  
  // Fetch data
  useEffect(() => {
    setLoading(true);
    
    // Fetch data from APIs
    Promise.all([
      axios.get('http://127.0.0.1:5000/api/v1/posting'),
      axios.get('http://127.0.0.1:5000/api/v1/posting_state'),
      axios.get('http://127.0.0.1:5000/api/v1/addtional_information')
    ])
    .then(([postingResponse, postingStateResponse, additionalInfoResponse]) => {
      setPosting(postingResponse.data.data);
      setPostingState(postingStateResponse.data.data);
      setPostingAdditionalInformation(additionalInfoResponse.data.data);
      setLoading(false);
    })
    .catch((error) => {
      setError('Failed to fetch data');
      setLoading(false);
    });
  }, []);
  
  // Handlers
  const handleSearch = (e) => setSearchQuery(e.target.value);

  const filteredPostings = posting.filter(
    (posting) =>
      posting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      posting.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPostings.length / itemsPerPage);

  // Pagination
  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (direction === "prev" && prev > 1) return prev - 1;
      if (direction === "next" && prev < totalPages) return prev + 1;
      return prev;
    });
  };

  // Current data for the main posting table
  const currentPostings = filteredPostings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        
        {/* Search and Add Posting Button */}
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          onChange={handleSearch}
          style={{ marginBottom: "20px" }}
        />
        <Button variant="contained" style={{ marginBottom: "20px" }}>
          Add Posting
        </Button>

        {/* Toggle Buttons */}
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
      <Table className="posting">
        <TableHead>
          <TableRow>
            <TableCell><strong>PostingID</strong></TableCell>
            <TableCell><strong>Title</strong></TableCell>
            <TableCell><strong>Description</strong></TableCell>
            <TableCell><strong>Job Posting URL</strong></TableCell>
            <TableCell><strong>Application Type</strong></TableCell>
            <TableCell><strong>Skills Description</strong></TableCell>
            <TableCell><strong>Work Type</strong></TableCell>
            <TableCell><strong>Zip Code</strong></TableCell>
            <TableCell><strong>Remote Allowed</strong></TableCell>
            <TableCell><strong>Location</strong></TableCell>
            <TableCell><strong>Listed Time</strong></TableCell>
            <TableCell><strong>Applies</strong></TableCell>
            <TableCell><strong>Views</strong></TableCell>
            <TableCell><strong>Expiring</strong></TableCell>
            <TableCell><strong>Original Listed Time</strong></TableCell>
            <TableCell><strong>Timezone Offset</strong></TableCell>
            <TableCell><strong>Apply Rate</strong></TableCell>
            <TableCell><strong>Remaining Time</strong></TableCell>
            <TableCell><strong>Close Time</strong></TableCell>
            <TableCell><strong>Application URL</strong></TableCell>
            <TableCell><strong>Posting Domain</strong></TableCell>
            <TableCell><strong>Experience Level</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPostings.map((posting, index) => (
            <TableRow key={index}>
              <TableCell>{posting.posting_id}</TableCell>
              <TableCell>{posting.title}</TableCell>
              <TableCell>{posting.description}</TableCell>
              <TableCell>{posting.job_posting_url}</TableCell>
              <TableCell>{posting.application_type}</TableCell>
              <TableCell>{posting.skills_description}</TableCell>
              <TableCell>{posting.worktype}</TableCell>
              <TableCell>{posting.zip_code}</TableCell>
              <TableCell>{posting.remote_allowed ? "Yes" : "No"}</TableCell>
              <TableCell>{posting.location}</TableCell>
              <TableCell>{posting.listed_time}</TableCell>
              <TableCell>{posting.applies}</TableCell>
              <TableCell>{posting.views}</TableCell>
              <TableCell>{posting.expiring}</TableCell>
              <TableCell>{posting.original_listed_time}</TableCell>
              <TableCell>{posting.timezone_offset}</TableCell>
              <TableCell>{posting.apply_rate}</TableCell>
              <TableCell>{posting.remaining_time}</TableCell>
              <TableCell>{posting.close_time}</TableCell>
              <TableCell>{posting.application_url}</TableCell>
              <TableCell>{posting.posting_domain}</TableCell>
              <TableCell>{posting.experience_level}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Additional Info Table */}
      {isAdditionalInfoVisible && postingAdditionalInformation.length > 0 && (
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
            {postingAdditionalInformation.map((info, index) => (
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
      {isPostingStateVisible && postingState.length > 0 && (
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
            {postingState.map((state, index) => (
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

      {loading && <Typography variant="h6">Loading...</Typography>}
      {error && <Typography variant="h6" color="error">{error}</Typography>}
    </div>
  );
};

export default Posting;
