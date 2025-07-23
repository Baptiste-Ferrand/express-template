
import dotenv from 'dotenv';
dotenv.config(); 

import express from 'express';
import { connectDB } from './src/config/database';
import { profilRouter } from './src/routers/profil.router';
import { errorHandler } from './src/middleware/error.middleware';

async function bootstrap() {
  await connectDB();

  const app = express();
  app.use(express.json());

  app.use('/api/profils', profilRouter);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
  });
}

bootstrap();
