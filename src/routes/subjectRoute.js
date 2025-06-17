import express from 'express';
const router = express.Router();
import {
  getSubjects,
  addSubject,
  updateSubject,
  
  deleteSubject,
} from '../controllers/subjectController.js';
import { verifyToken } from '../middleware/verifyToken.js';

// Routes
router.get('/subjects', getSubjects);
router.post('/subjects', addSubject);
router.put('/subjects/:id', verifyToken, updateSubject);
router.delete('/subjects/:id',verifyToken, deleteSubject);

export default router;