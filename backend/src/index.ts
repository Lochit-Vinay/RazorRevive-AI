import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dashboardRoutes from './routes/dashboard.routes';
import recoveryRoutes from './routes/recovery.routes';
import { errorHandler } from './middleware/errorHandler';
import { prisma } from './db';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

app.use(express.json());

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/recovery', recoveryRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

export default app;

const randomizeDates = async () => {
  try {
    const cases = await prisma.recoveryCase.findMany();
    let updated = 0;
    for (const c of cases) {
      // Skip recently created cases (like from run simulation)
      if (Date.now() - c.createdAt.getTime() < 24 * 60 * 60 * 1000) continue;

      const rand = Math.random();
      let hoursAgo = 0;
      if (rand < 0.3) hoursAgo = Math.random() * 23; // 30% in last 24h
      else if (rand < 0.6) hoursAgo = 24 + Math.random() * (24 * 6); // 30% in last 7d
      else if (rand < 0.85) hoursAgo = 24 * 7 + Math.random() * (24 * 23); // 25% in last 30d
      else hoursAgo = 24 * 30 + Math.random() * (24 * 10); // 15% > 30d

      const newDate = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
      
      await prisma.recoveryCase.update({ where: { id: c.id }, data: { createdAt: newDate, updatedAt: newDate } });
      await prisma.recoveryAction.updateMany({ where: { recoveryCaseId: c.id }, data: { executedAt: newDate } });
      await prisma.auditLog.updateMany({ where: { recoveryCaseId: c.id }, data: { createdAt: newDate } });
      await prisma.paymentFailure.updateMany({ where: { payment: { recoveryCases: { some: { id: c.id } } } }, data: { createdAt: newDate } });
      updated++;
    }
    if (updated > 0) console.log(`Randomized dates for ${updated} cases to populate dashboard.`);
  } catch (e) {
    console.error('Failed to randomize dates:', e);
  }
};

if (require.main === module) {
  randomizeDates().then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  });
}
