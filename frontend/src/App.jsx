import React from 'react';
import { BrowserRouter as Router, Routes, Route ,Outlet,Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Company from './pages/Company';
import DataVisualization from './pages/DataVisualization';
import PostingTitle from './pages/Title'

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Home />} />
        <Route path="/company" element={<Company />} />
        <Route path="/postingtitle" element={<PostingTitle />} />
        <Route path="/datavisualization" element={<DataVisualization />} />
        {/* Private Routes */}
      </Routes>
    </Router>
  );
};

export default App;
