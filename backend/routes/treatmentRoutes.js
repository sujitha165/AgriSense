const express = require('express');
const router = express.Router();
const TreatmentController = require('../controllers/treatmentController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/saved', authenticate, TreatmentController.getAllSaved);
router.get('/:scanId', TreatmentController.getByScanId);
router.post('/', authenticate, TreatmentController.saveTreatment);

module.exports = router;
