import React from 'react';
import { BrowserRouter as Router, Routes, Route ,Outlet,Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Company from './pages/Company';
import Job from './pages/Job';
import Posting from './pages/Posting';
import DataVisualization from './pages/DataVisualization';
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Home />} />
        <Route path="/job" element={<Job />} />
        <Route path="/posting" element={<Posting />} />
        <Route path="/company" element={<Company />} />
        <Route path="/datavisualization" element={<DataVisualization />} />
        {/* Private Routes */}
      </Routes>
    </Router>
  );
};

export default App;
