import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import StockPage from './pages/StockPage';
import HeatmapPage from './pages/HeatmapPage';

const App = () => (
  <Router>
    <Container>
      <Routes>
        <Route path="/" element={<StockPage />} />
        <Route path="/heatmap" element={<HeatmapPage />} />
      </Routes>
    </Container>
  </Router>
);

export default App;
