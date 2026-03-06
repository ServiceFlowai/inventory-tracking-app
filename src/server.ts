import express from 'express';
import cors from 'cors';
import reorderRecommendations from './api/reorderRecommendations';

const app = express();
app.use(cors());

app.use('/api/reorder-recommendations', reorderRecommendations);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});