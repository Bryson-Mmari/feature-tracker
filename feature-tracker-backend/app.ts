import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';
import featureRoutes from './routes/featureRoutes';

const cors = require('cors');
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/features', featureRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
