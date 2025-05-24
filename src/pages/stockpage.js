import React, { useEffect, useState } from 'react';
import {
  Typography, Select, MenuItem, FormControl, InputLabel, Box, CircularProgress,
} from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

const API_BASE = 'http://20.244.56.144/evaluation-service/stocks';

const StockPage = () => {
  const [stocks, setStocks] = useState({});
  const [selectedStock, setSelectedStock] = useState('');
  const [timeInterval, setTimeInterval] = useState(30);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get(API_BASE);
        setStocks(response.data.stocks);
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
    };
    fetchStocks();
  }, []);

  useEffect(() => {
    if (selectedStock) {
      fetchStockHistory(selectedStock, timeInterval);
    }
  }, [selectedStock, timeInterval]);

  const fetchStockHistory = async (ticker, minutes) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/${ticker}?minutes=${minutes}`);
      setStockData(response.data);
    } catch (error) {
      console.error('Error fetching stock history:', error);
    }
    setLoading(false);
  };

  const handleStockChange = (e) => setSelectedStock(e.target.value);
  const handleIntervalChange = (e) => setTimeInterval(e.target.value);

  const transformedData = stockData?.map(item => ({
    time: new Date(item.lastUpdatedAt).toLocaleTimeString(),
    price: item.price,
  })) || [];

  const average = transformedData.length
    ? transformedData.reduce((sum, d) => sum + d.price, 0) / transformedData.length
    : 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Stock Price Tracker</Typography>
      <Box display="flex" gap={2} mb={4}>
        <FormControl fullWidth>
          <InputLabel>Stock</InputLabel>
          <Select value={selectedStock} label="Stock" onChange={handleStockChange}>
            {Object.entries(stocks).map(([name, ticker]) => (
              <MenuItem key={ticker} value={ticker}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Time Interval (min)</InputLabel>
          <Select value={timeInterval} label="Time Interval" onChange={handleIntervalChange}>
            {[5, 15, 30, 60].map((interval) => (
              <MenuItem key={interval} value={interval}>{interval}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={transformedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#8884d8" name="Stock Price" />
            <Line type="monotone" dataKey={() => average} stroke="#82ca9d" dot={false} name="Average" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default StockPage;
