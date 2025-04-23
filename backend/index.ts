import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import eventRoutes from './routes/events';

// โหลด .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);

// ทดสอบว่าเซิร์ฟเวอร์ยังอยู่
app.get('/', (req, res) => {
  res.send('Calendar App Backend is running!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
