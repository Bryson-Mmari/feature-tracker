import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (_req, res) => {
  res.send('Feature Tracker API setup complete');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
