import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from 'axios';
import { Table, Typography, Button,TextField } from "@mui/material";
import "../styles/Job.css";


const Job = () => {
  const menuItems = ["Dashboard", "Data visualization", "Job", "Company", "Posting"];
  const routes = ["/", "/datavisualization", "/job", "/company", "/posting"];

  const [jobs, setJobs] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [newJob,setNewJob ] = useState({
    job_description: '',
    industry_name: '',
    skill_name: '',
    salary_type: '',
    value: '',
    currency: '',
    pay_period: '',

  });
  const [editingJob, setEditingJob] = useState(null);

  const itemsPerPage = 20;


  const fetchJob=() => {
    // Fetch job data
    axios.get("http://127.0.0.1:5000/job")
      .then((response) => {
        setJobs(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to fetch job data');
        setLoading(false);
      });
    };

    const handleCreate = () => {
      if (
        !newJob.job_id||
        !newJob.job_description ||
        !newJob.inferred||
        !newJob.benefit_type_id ||
        !newJob.skill_abr||
        !newJob.industry_id ||
        !newJob. currency ||
        !newJob. pay_period ||
        !newJob. salary_type||
        !newJob. value 
      ) {
        alert("Please fill in all fields");
        return;
      }

      // Mapping dữ liệu frontend sang backend
  
      axios
        .post("http://127.0.0.1:5000/add_job", newJob, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(() => {
          setNewJob({
            job_id:'',
            job_description: '',
            inferred:'',
            benefit_type_id:'',
            skill_abr:'',
            industry_id: '',
            currency:'',
            pay_period: '',
            salary_type: '',
            value: '',
          });
          setIsCreating(false);
          alert('Create Job Success.');
          fetchJob(); // Gọi lại fetch để cập nhật danh sách
        })
        .catch((error) => {
          console.error('Failed to create job:', error.response?.data || error.message);
          alert(`Failed to create job: ${error.response?.data?.message || 'Unknown error'}`);
        });
    };
    
    const handleUpdate = (job_id, updateData) => {
      axios
        .put(`http://127.0.0.1:5000/update_job/${job_id}`, updateData, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(() => {
          alert(`Job ID ${job_id} updated successfully.`);
          setEditingJob(null);
          fetchJob(); // Gọi lại fetch để cập nhật danh sách
        })
        .catch((error) => {
          console.error(`Failed to update job ${job_id}`, error.response?.data || error.message);
          alert(`Failed to update job: ${job_id}: ${error.response?.data?.message || "Unknown error."}`);
        });
    };
    
   
    const handleDelete = (job_id) => {
      if (!window.confirm(`Are you sure you want to delete job ID ${job_id}?`)) {
        return;
      }
    
      axios
        .delete(`http://127.0.0.1:5000/delete_job/${job_id}`)
        .then(() => {
          alert(`Job ID ${job_id} deleted successfully.`);
          fetchJob(); // Gọi lại fetch để cập nhật danh sách
        })
        .catch((error) => {
          console.error(`Failed to delete job with ID ${job_id}`, error);
          alert(`Failed to delete job ID ${job_id}: ${error.response?.data?.message || "Unknown error."}`);
        });
    };
    

  useEffect(() => {

    // Fetch data từ API
    axios.get('http://127.0.0.1:5000/job')
      .then((response) => {
        setJobs(response.data.data); // Dữ liệu từ API
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to fetch Job data');
        setLoading(false);
      });
  }, []);

    // Fetch benefit data
    axios.get("http://127.0.0.1:5000/benefit")
      .then((response) => {
        setBenefits(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to fetch benefit data');
        setLoading(false);
      });
 [];

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="job-page">
      <div className="container">
        <Navbar
          title="LinkedlnJobPosting"
          menuItems={menuItems}
          routes={routes}
          active="Job"
        />
      {editingJob && (
        <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <Typography variant="h6">Update Job</Typography>

          <TextField
            label="Job ID"
            fullWidth
            value={editingJob.job_id}
            onChange={(e) => setEditingJob({ ...editingJob, job_id: e.target.value })}
            style={{ marginBottom: '10px' }}
          />

          <TextField
            label="Job Description"
            fullWidth
            value={editingJob.job_description}
            onChange={(e) => setEditingJob({ ...editingJob, job_description: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          
          <TextField
            label="Skill abr"
            fullWidth
            value={editingJob.skill_abr}
            onChange={(e) => setEditingJob({ ...editingJob, skill_abr: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Salary Type"
            fullWidth
            value={editingJob.salary_type}
            onChange={(e) => setEditingJob({ ...editingJob, salary_type: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Value"
            fullWidth
            type="number"
            value={editingJob.value}
            onChange={(e) => setEditingJob({ ...editingJob, value: Number(e.target.value) || '' })}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Currency"
            fullWidth
            value={editingJob.currency}
            onChange={(e) => setEditingJob({ ...editingJob, currency: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Pay Period"
            fullWidth
            value={editingJob.pay_period}
            onChange={(e) => setEditingJob({ ...editingJob, pay_period: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleUpdate(editingJob.job_id, editingJob)}
            style={{ marginRight: '10px' }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setEditingJob(null)}
          >
            Cancel
          </Button>
        </div>
      )}

      {isCreating ? (
        <div style={{ margin: '80px 0', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <Typography variant="h6">Create New Job</Typography>
          <TextField
            label="Job ID"
            fullWidth
            value={newJob.job_id}
            onChange={(e) => setNewJob({ ...newJob, job_id: e.target.value })}
            style={{ marginBottom: '10px' }}
          />

          <TextField
            label="Job Description"
            fullWidth
            value={newJob.job_description}
            onChange={(e) => setNewJob({ ...newJob, job_description: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Inferred"
            fullWidth
            value={newJob.inferred}
            onChange={(e) => setNewJob({ ...newJob, inferred: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Benefit Type ID"
            fullWidth
            value={newJob.benefit_type_id}
            onChange={(e) => setNewJob({ ...newJob,benefit_type_id: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Skill Abr"
            fullWidth
            value={newJob.skill_abr}
            onChange={(e) => setNewJob({ ...newJob, skill_abr: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Industry ID"
            fullWidth
            value={newJob.industry_id}
            onChange={(e) => setNewJob({ ...newJob, industry_id: e.target.value })}
            style={{ marginBottom: '10px' }}
          />

          <TextField
            label="Currency"
            fullWidth
            value={newJob.currency}
            onChange={(e) => setNewJob({ ...newJob, currency: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Pay Period"
            fullWidth
            value={newJob.pay_period}
            onChange={(e) => setNewJob({ ...newJob, pay_period: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Salary Type"
            fullWidth
            value={newJob.salary_type}
            onChange={(e) => setNewJob({ ...newJob, salary_type: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Value"
            fullWidth
            type="number"
            value={newJob.value}
            onChange={(e) => setNewJob({ ...newJob, value: Number(e.target.value) || '' })}
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
          style={{ marginBottom: '10px' }}
        >
          New
        </Button>
      )}

        <div style={{ display: "flex", marginTop: "10px" }}>
          {/* Job Table */}
          <div style={{ flex: 2, marginRight: "30px" }}>
            <Button
            variant="contained"
            color="primary"
            onClick={() => setIsCreating(true)}
            style={{ marginBottom: "10px" }}
          >
            Add Job
            </Button>
            <table className="job-table">
              <thead>
                <tr>
                  <th colSpan="14" className="header">
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
                 <th rowSpan="3"colSpan = "4"
                 >Actions</th>

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
                {currentJobs.length > 0 ? (
                  currentJobs.map((job) => (
                    <tr key={job.job_id}>
                      <td>{job.job_id}</td>
                      <td>{job.job_description}</td>
                      <td className="checkbox-cell">
                        <input type="checkbox" checked={job.inferred} readOnly />
                      </td>
                      <td>{job.type}</td>
                      <td>{job.industry_name}</td>
                      <td>{job.skill_name}</td>
                      <td>{job.salary_type}</td>
                      <td>{job.value}</td>
                      <td>{job.currency}</td>
                      <td>{job.pay_period}</td>
                      <td>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setEditingJob(job)}
                      >
                        Update
                      </Button>
                      </td>
                      <td>
                      <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDelete(job.job_id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center" }}>
                      No jobs available.
                    </td>
                  </tr>
                )}
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
                  <th>Benefit type</th>
                </tr>
              </thead>
              <tbody>
                {currentBenefits.length > 0 ? (
                  currentBenefits.map((benefit) => (
                    <tr key={benefit.benefit_type_id}>
                      <td>{benefit.benefit_type_id}</td>
                      <td>{benefit.type}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      No benefits available.
                    </td>
                  </tr>
                )}
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
          <Typography
            variant="body1"
            style={{ margin: "0 10px", display: "inline-block" }}
          >
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