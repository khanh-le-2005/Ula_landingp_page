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
  const PORT = Number(process.env.PORT) || 3002;

  const cookieParser = require('cookie-parser');
  const cors = require('cors');

  app.use(cors({ origin: true, credentials: true }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const siteMiddleware = require('./Backend/src/middlewares/siteMiddleware');
  app.use(siteMiddleware);

  // Paths corrected for nested Backend/Backend structure
  const dbPath = path.resolve(process.cwd(), './Backend/src/config/db');
  console.log(`Checking DB path: ${dbPath}`);
  
  const connectDB = require(dbPath);
  const authRoutes = require('./Backend/src/routes/authRoutes');
  const lpRoutes = require('./Backend/src/routes/lpRoutes');
  const leadRoutes = require('./Backend/src/routes/leadRoutes');
  const imageRoutes = require('./Backend/src/routes/imageRoutes');
  const trackRoutes = require('./Backend/src/routes/trackRoutes');
  const prizeRoutes = require('./Backend/src/routes/prizeRoutes');
  const affiliateRoutes = require('./Backend/src/routes/affiliateRoutes');
  const campaignRoutes = require('./Backend/src/routes/campaignRoutes');

  app.use('/api/auth', authRoutes);
  app.use('/api/users', authRoutes); // Alias cho frontend cũ
  app.use('/api/landing-page', lpRoutes);
  app.use('/api/leads', leadRoutes);
  app.use('/api/images', imageRoutes);
  app.use('/api/track', trackRoutes);
  app.use('/api/prizes', prizeRoutes);
  app.use('/api/affiliates', affiliateRoutes);
  app.use('/api/campaigns', campaignRoutes);

  // Alias for legacy Frontend compatibility
  const prizeController = require('./Backend/src/controllers/prizeController');
  const { verifyToken, checkRole } = require('./Backend/src/utils/authUtil');
  app.get('/admin/lucky-wheel', verifyToken, checkRole(['ADMIN', 'EDITOR']), prizeController.getAllPrizes);
  app.get('/api/admin/lucky-wheel', verifyToken, checkRole(['ADMIN', 'EDITOR']), prizeController.getAllPrizes);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', mode: 'mongodb' });
  });

  // 404 Handler for API routes
  app.use('/api', (req, res) => {
    res.status(404).json({ success: false, message: `API Endpoint ${req.originalUrl} không tồn tại.` });
  });

  // Global Error Middleware (Phải đặt cuối cùng của các Route)
  const errorMiddleware = require('./Backend/src/middlewares/errorMiddleware');
  app.use(errorMiddleware);

  await connectDB();
  console.log('✅ Running in MongoDB Monolith mode');

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    
    // SPA Fallback for Development
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      const isGerman = url.includes('/german') || url.includes('/tieng-duc');
      const entryPoint = isGerman ? '/src/ula-German/main.tsx' : '/src/ula-chinese/main.tsx';
      
      try {
        let template = await vite.transformIndexHtml(url, `
          <!doctype html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>ULA Landing Page</title>
            </head>
            <body>
              <div id="root"></div>
              <script type="module" src="${entryPoint}"></script>
            </body>
          </html>
        `);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Dist Path for production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));

    // Catch-all for SPA Routes (including /german, /chinese)
    app.get(['/german*', '/chinese*', '/tieng-duc*', '/tieng-trung*', '*'], (_req, res) => {
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
