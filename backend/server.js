import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import reportAnalyzerRoutes from './routes/reportAnalyzerRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());

// Restrict browser requests that can change cookie-based sessions.
app.use('/api/auth', (req, res, next) => {
  const sessionMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  if (!sessionMethods.includes(req.method)) {
    return next();
  }

  const origin = req.get('Origin');

  if (origin && origin !== FRONTEND_ORIGIN) {
    return res.status(403).json({
      success: false,
      message: 'Request origin is not allowed.',
    });
  }

  next();
});

// Register, login, refresh and logout use the new session handlers.
app.use('/api/auth', sessionRoutes);

// Preserve existing profile and password-recovery endpoints.
app.use('/api/auth', authRoutes);

app.use('/api/assessments', assessmentRoutes);

app.use('/api/report-analyzer', reportAnalyzerRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CureAI API is running!',
  });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const connectionStatus = await mongoose.connection.db.admin().command({
      connectionStatus: 1,
      showPrivileges: true,
    });

    console.log(
      "MongoDB permission diagnostic:",
      JSON.stringify(connectionStatus.authInfo, null, 2)
    );

    console.log('MongoDB connected successfully!');

    app.listen(PORT, () => {
      console.log(`CureAI API running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

startServer();
