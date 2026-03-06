import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  const recommendations = [
    { sku: 'SKU123', recommendedQuantity: 100, currentStock: 50, leadTime: 7 },
    { sku: 'SKU456', recommendedQuantity: 200, currentStock: 80, leadTime: 10 }
  ];
  res.json(recommendations);
});

export default router;