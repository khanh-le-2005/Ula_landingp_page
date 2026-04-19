import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { createRequire } from 'module';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const require = createRequire(import.meta.url);
const hasMongoUri = Boolean(process.env.MONGODB_URI?.trim());

async function startServer() {
  if (!hasMongoUri) {
    throw new Error(
      'MONGODB_URI is missing. Create a .env file with real MongoDB credentials so the app uses live backend data instead of mock data.',
    );
  }

  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const connectDB = require('./Backend/src/config/db');
  const authRoutes = require('./Backend/src/routes/authRoutes');
  const lpRoutes = require('./Backend/src/routes/lpRoutes');
  const leadRoutes = require('./Backend/src/routes/leadRoutes');
  const imageRoutes = require('./Backend/src/routes/imageRoutes');

  app.use('/api/auth', authRoutes);
  app.use('/api/landing-page', lpRoutes);
  app.use('/api/leads', leadRoutes);
  app.use('/api/images', imageRoutes);
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', mode: 'mongodb' });
  });

  await connectDB();
  console.log('✅ Running in MongoDB mode');

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
