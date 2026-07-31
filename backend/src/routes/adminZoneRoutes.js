const express = require('express');
const {
  createZone,
  updateZone,
  deleteZone,
  getAllZones
} = require('../controllers/zoneController');
const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// All Admin Zone routes require protectAdmin
router.use(protectAdmin);

router.get('/', getAllZones);
router.post('/', createZone);
router.put('/:id', updateZone);
router.delete('/:id', deleteZone);

module.exports = router;
