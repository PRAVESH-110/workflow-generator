import dotenv from 'dotenv';
import app from './app.js';
import { connectDatabase } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/workflow-auto';

const startServer = async () => {
  try {
    await connectDatabase(MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
