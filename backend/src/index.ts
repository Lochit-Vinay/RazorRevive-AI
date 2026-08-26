import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dashboardRoutes from './routes/dashboard.routes';
import recoveryRoutes from './routes/recovery.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/recovery', recoveryRoutes);
// trigger restart

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
