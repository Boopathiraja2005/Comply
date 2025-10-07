import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import simulateRoutes from './routes/simulate.js';
import scenarioRoutes from './routes/scenarios.js';
import reportRoutes from './routes/report.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/simulate', simulateRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/report', reportRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ROI Simulator API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});