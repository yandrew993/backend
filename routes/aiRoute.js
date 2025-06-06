const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getAIResponse } = require('../controllers/aiController');

router.post('/ai', authMiddleware, getAIResponse);

export default router;
