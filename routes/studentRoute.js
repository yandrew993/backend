import express from 'express';
const router = express.Router();
import {
  getAllStudents,
  addStudent,
  updateStudent,
  getTotalStudents,
  getTotalStudentsWithBooks,
  deleteStudent,
} from '../controllers/studentController.js';
import { verifyToken } from '../middleware/verifyToken.js';

// Routes
router.get('/students', getAllStudents);
router.get('/students/total', getTotalStudents);
router.get('/students/withbooks', getTotalStudentsWithBooks);
// router.post('/students', addStudent);
router.put('/students/:id', verifyToken, updateStudent);
router.delete('/students/:id',verifyToken, deleteStudent);

export default router;