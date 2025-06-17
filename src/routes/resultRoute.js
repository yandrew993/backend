import express from 'express';
const router = express.Router();
import {
    getResultsByStudentId,
    addResult,
    updateResult,
    deleteResult,
    getResultsByTeacherId,
  } from '../controllers/resultController.js';
import { verifyToken } from '../middleware/verifyToken.js';



// Result routes
router.get('/students/:studentId/results', getResultsByStudentId);
router.get("/results/teacher/:teacherId", getResultsByTeacherId);
router.post('/results', addResult);
router.put('/results/:id', updateResult);
router.delete('/results/:id', deleteResult);

export default router;