import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Button, TextField
} from "@mui/material";
import axios from "axios";
import "../styles/Posting.css";
import BKLOGO from "../assets/BKLOGO.png";

const Posting = () => {
    const menuItems = ["Dashboard", "Data visualization", "Job", "Company", "Posting"];
    const routes = ["/", "/datavisualization", "/job", "/company", "/posting"];

    const [isAdditionalInfoVisible, setAdditionalInfoVisible] = useState(false);
    const [isPostingStateVisible, setPostingStateVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [error, setError] = useState(null);
    const [postings, setPostings] = useState([]);
    const [postingState, setPostingState] = useState([]);
    const [additionalInfo, setAdditionalInfo] = useState([]);
    const [editingPosting, setEditingPosting] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newPosting, setNewPosting] = useState({
        posting_id: '',
        company_id: '',
        application_type: '',
        job_id: '',
        title:'',
        formatted_worktype: '',
        location: '',
        posting_description: '',
    });
    const fetchPosting = () => {
        axios.get("http://127.0.0.1:5000/api/v1/posting")
            .then((response) => {
                setPostings(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch Posting data", error);
                setError('Failed to fetch Posting data');
                setLoading(false);
            });
    };

    const handleCreate = () => {
        if
            (!newPosting.title ||
            !newPosting.posting_id ||
            !newPosting.location ||
            !newPosting.company_id ||
            !newPosting.job_id) {
            alert(' Fill out full form.');
            return;
        }

        axios
            .post('http://127.0.0.1:5000/api/v1/posting', newPosting, {
                headers: { 'Content-Type': 'application/json' },
            })
            .then(() => {
                setNewPosting({
                    posting_id: '',
                    company_id: '',
                    application_type: '',
                    job_id: '',
                    title:'',
                    formatted_worktype: '',
                    location: '',
                    posting_description: '',
                });
                setIsCreating(false);
                alert('Add Posting Success.');
                fetchPosting();
            })
            .catch((error) => {
                console.error('Failed to create Posting:', error.response?.data || error.message);
                alert(`Failed to create Posting: ${error.response?.data?.message || 'Không xác định'}`);
            });
    };
    const handleUpdate = (posting_id, updatedData) => {
        axios
            .put(`http://127.0.0.1:5000/api/v1/posting/${posting_id}`, updatedData, {
                headers: { "Content-Type": "application/json" },
            })
            .then(() => {
                alert(`Posting ID ${posting_id} updated successfully.`);
                setEditingPosting(null);
                fetchPosting(); // 
            })
            .catch((error) => {
                console.error(`Failed to update Posting ID ${posting_id}`, error.response?.data || error.message);
                alert(`Failed to update company ID ${posting_id}: ${error.response?.data?.message || "Unknown error."}`);
            });
    };

    const handleDelete = (posting_id) => {
        if (!window.confirm(`Are you sure you want to delete This Posting ${posting_id}?`)) {
            return;
        }

        axios
            .delete(`http://127.0.0.1:5000/api/v1/posting/${posting_id}`)
            .then(() => {
                alert(`Posting ID ${posting_id} deleted successfully.`);
                fetchPosting(); // Fetch lại danh sách sau khi xóa
            })
            .catch((error) => {
                console.error(`Failed to delete company with ID ${posting_id}`, error);
                alert(`Failed to delete company ID ${posting_id}: ${error.response?.data?.message || "Unknown error."}`);
            });
    };

    useEffect(() => {
        // Fetch data từ ba API
        const fetchData = async () => {
            try {
                const postingRes = await axios.get("http://127.0.0.1:5000/api/v1/posting");
                const postingStateRes = await axios.get("http://127.0.0.1:5000/api/v1/posting_state");
                const additionalInfoRes = await axios.get("http://127.0.0.1:5000/api/v1/additional_information");

                setPostings(postingRes.data.postings);
                setPostingState(postingStateRes.data.states);
                setAdditionalInfo(additionalInfoRes.data.additional_information);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

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

    return (
        <div className="posting-container">
            {/* Navbar */}
            <Navbar
                title="LinkedlnJobPosting"
                menuItems={menuItems}
                routes={routes}
                active="Posting"
            />

            {editingPosting && (
                <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <Typography variant="h6">Update Job</Typography>
                    <TextField
                        label="Application Type"
                        fullWidth
                        value={editingPosting.application_type}
                        onChange={(e) => setEditingPosting({ ...editingPosting, application_type: e.target.value })}
                        style={{ marginBottom: '10px' }}
                    />

                    <TextField
                        label="Apply Rate"
                        fullWidth
                        value={editingPosting.apply_rate || ''}
                        onChange={(e) => setEditingPosting({ ...editingPosting, apply_rate: Number(e.target.value) || null })}
                        style={{ marginBottom: '10px' }}
                    />

                    <TextField
                        label="Company ID"
                        fullWidth
                        value={editingPosting.company_id}
                        onChange={(e) => setEditingPosting({ ...editingPosting, company_id: e.target.value })}
                        style={{ marginBottom: '10px' }}
                    />

                    <TextField
                        label="Work Type"
                        fullWidth
                        value={editingPosting.formatted_worktype}
                        onChange={(e) => setEditingPosting({ ...editingPosting, formatted_worktype: e.target.value })}
                        style={{ marginBottom: '10px' }}
                    />

                    <TextField
                        label="Job ID"
                        fullWidth
                        value={editingPosting.job_id}
                        onChange={(e) => setEditingPosting({ ...editingPosting, job_id: e.target.value })}
                        style={{ marginBottom: '10px' }}
                    />

                    <TextField
                        label="Job Posting URL"
                        fullWidth
                        value={editingPosting.job_posting_url}
                        onChange={(e) => setEditingPosting({ ...editingPosting, job_posting_url: e.target.value })}
                        style={{ marginBottom: '10px' }}
                    />

                    <TextField
                        label="Location"
                        fullWidth
                        value={editingPosting.location}
                        onChange={(e) => setEditingPosting({ ...editingPosting, location: e.target.value })}
                        style={{ marginBottom: '10px' }}
                    />

                    <TextField
                        label="Posting Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={editingPosting.posting_description}
                        onChange={(e) => setEditingPosting({ ...editingPosting, posting_description: e.target.value })}
                        style={{ marginBottom: '10px' }}
                    />

                    <TextField
                        label="Posting ID"
                        fullWidth
                        type="number"
                        value={editingPosting.posting_id}
                        onChange={(e) => setEditingPosting({ ...editingPosting, posting_id: Number(e.target.value) })}
                        style={{ marginBottom: '10px' }}
                    />

                    <TextField
                        label="Remaining Time"
                        fullWidth
                        value={editingPosting.remaining_time || ''}
                        onChange={(e) => setEditingPosting({ ...editingPosting, remaining_time: e.target.value })}
                        style={{ marginBottom: '10px' }}
                    />

                    <TextField
                        label="Remote Allowed"
                        fullWidth
                        value={editingPosting.remote_allowed || ''}
                        onChange={(e) => setEditingPosting({ ...editingPosting, remote_allowed: e.target.value })}
                        style={{ marginBottom: '10px' }}
                    />

                    <TextField
                        label="Skills Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={editingPosting.skills_description}
                        onChange={(e) => setEditingPosting({ ...editingPosting, skills_description: e.target.value })}
                        style={{ marginBottom: '10px' }}
                    />

                    <TextField
                        label="Title"
                        fullWidth
                        value={editingPosting.title}
                        onChange={(e) => setEditingPosting({ ...editingPosting, title: e.target.value })}
                        style={{ marginBottom: '10px' }}
                    />

                    <TextField
                        label="ZIP Code"
                        fullWidth
                        value={editingPosting.zip_code}
                        onChange={(e) => setEditingPosting({ ...editingPosting, zip_code: e.target.value })}
                        style={{ marginBottom: '10px' }}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdate(editingPosting.posting_id, editingPosting)}
                        style={{ marginRight: '10px' }}
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setEditingPosting(null)}
                    >
                        Cancel
                    </Button>
                </div>
            )}


            {isCreating ? (
                <div style={{ margin: '60px ', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <Typography variant="h6">Create New Posting</Typography>
                    <TextField
                        label="Job ID"
                        fullWidth
                        value={newPosting.job_id}
                        onChange={(e) => setNewPosting({ ...newPosting, job_id: e.target.value })}
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        TextField
                        label="Company ID"
                        fullWidth
                        value={newPosting.company_id}
                        onChange={(e) => setNewPosting({ ...newPosting, company_id: e.target.value })}
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        label="Application Type"
                        fullWidth
                        value={newPosting.application_type}
                        onChange={(e) => setNewPosting({ ...newPosting, application_type: e.target.value })}
                        style={{ marginBottom: '10px' }}
                    />

                    <TextField
                        label="Formatted Worktype"
                        fullWidth
                        value={newPosting.formatted_worktype}
                        onChange={(e) => setNewPosting({ ...newPosting, formatted_worktype: e.target.value })}
                        style={{ marginBottom: '10px' }}
                    />



                    <TextField
                        label="Location"
                        fullWidth
                        value={newPosting.location}
                        onChange={(e) => setNewPosting({ ...newPosting, location: e.target.value })}
                        style={{ marginBottom: '10px' }}
                    />

                    <TextField
                        label="Posting Description"
                        fullWidth
                        multiline
                        value={newPosting.posting_description}
                        onChange={(e) => setNewPosting({ ...newPosting, posting_description: e.target.value })}
                        style={{ marginBottom: '10px' }}
                    />

                    <TextField
                        label="Posting ID"
                        fullWidth
                        value={newPosting.posting_id}
                        onChange={(e) => setNewPosting({ ...newPosting, posting_id: e.target.value })}
                        style={{ marginBottom: '10px' }}
                    />



                    <TextField
                        label="Title"
                        fullWidth
                        value={newPosting.title}
                        onChange={(e) => setNewPosting({ ...newPosting, title: e.target.value })}
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


            {/* Header Section */}
            <div className="posting-header">
                <Typography variant="h4" gutterBottom>
                    POSTING
                </Typography>
                <div className="bird" style={{ left: "10%", top: "10%" }}>
                    <img src={BKLOGO} alt="Logo" style={{ width: "150%" }} />
                </div>
                <div className="button-container">
                    <Button
                        variant="contained"
                        onClick={() => setIsCreating(true)}
                        style={{ marginRight: "10px" }}
                    >
                        Create Posting
                    </Button>
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
                        <TableCell><strong>Posting ID</strong></TableCell>
                        <TableCell><strong>Title</strong></TableCell>
                        <TableCell><strong>Description</strong></TableCell>
                        <TableCell><strong>Job Posting URL</strong></TableCell>
                        <TableCell><strong>Application Type</strong></TableCell>
                        <TableCell><strong>Skills Description</strong></TableCell>
                        <TableCell><strong>Work Type</strong></TableCell>
                        <TableCell><strong>Zip Code</strong></TableCell>
                        <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentPostings.map((posting) => (
                        <TableRow key={posting.posting_id}>
                            <TableCell>{posting.posting_id}</TableCell>
                            <TableCell>{posting.title}</TableCell>
                            <TableCell>{posting.posting_description}</TableCell>
                            <TableCell>
                                <a href={posting.job_posting_url} target="_blank" rel="noopener noreferrer">
                                    Link
                                </a>
                            </TableCell>
                            <TableCell>{posting.application_type}</TableCell>
                            <TableCell>{posting.skills_description}</TableCell>
                            <TableCell>{posting.formatted_worktype}</TableCell>
                            <TableCell>{posting.zip_code}</TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="Cyan"
                                    onClick={() => setEditingPosting(posting.posting_id)} // Hiển thị form chỉnh sửa với dữ liệu của công ty
                                    style={{ marginRight: '10px' }}
                                >
                                    Update
                                </Button>

                                <Button
                                    variant="contained"
                                    color="secondary"
                                    style={{ marginRight: '10px' }}
                                    onClick={() => handleDelete(posting.posting_id)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
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
                        {additionalInfo.map((info) => (
                            <TableRow key={info.additional_info_id}>
                                <TableCell>{info.additional_info_id}</TableCell>
                                <TableCell>{info.close_time}</TableCell>
                                <TableCell>
                                    <a href={info.application_url} target="_blank" rel="noopener noreferrer">
                                        Link
                                    </a>
                                </TableCell>
                                <TableCell>{info.posting_domain}</TableCell>
                                <TableCell>{info.formatted_experience_level}</TableCell>
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {postingState.map((state) => (
                            <TableRow key={state.posting_state_id}>
                                <TableCell>{state.posting_state_id}</TableCell>
                                <TableCell>{state.listed_time}</TableCell>
                                <TableCell>{state.applies}</TableCell>
                                <TableCell>{state.views}</TableCell>
                                <TableCell>{state.expiry}</TableCell>
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

