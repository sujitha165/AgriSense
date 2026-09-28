const express = require('express');
const router = express.Router();
const ProfitController = require('../controllers/profitController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', ProfitController.getAll);
router.post('/', ProfitController.create);
router.put('/:id', ProfitController.update);
router.delete('/:id', ProfitController.delete);

module.exports = router;
