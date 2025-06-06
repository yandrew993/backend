import express from 'express';
const router = express.Router();
import {
  getClasses,
  addClass,
  updateClass,
  deleteClass,
} from '../controllers/classController.js';
import { verifyToken } from '../middleware/verifyToken.js';

// Routes
router.get('/class', getClasses);
router.post('/class', addClass);
router.put('/class/:id', verifyToken, updateClass);
router.delete('/class/:id',verifyToken, deleteClass);

export default router;