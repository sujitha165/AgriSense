const express = require('express');
const router = express.Router();
const DiseaseController = require('../controllers/diseaseController');
const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Analyze can optionally use authenticate or pass through for demo
router.post('/analyze', (req, res, next) => {
  // If authorization header exists, authenticate; otherwise proceed with default demo user
  if (req.headers.authorization) {
    return authenticate(req, res, next);
  }
  req.user = { id: 1, name: 'Arun Kumar' };
  next();
}, upload.single('image'), DiseaseController.analyze);

router.get('/history', authenticate, DiseaseController.getHistory);
router.get('/:id', DiseaseController.getById);
router.delete('/:id', authenticate, DiseaseController.deleteScan);

module.exports = router;
