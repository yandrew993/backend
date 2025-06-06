import express from 'express';
const router = express.Router();
import {
    getAllAnnouncements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  } from '../controllers/announcementController.js';
import { verifyToken } from '../middleware/verifyToken.js';



// Announcement routes
router.get('/announcements', getAllAnnouncements);
router.post('/announcements', addAnnouncement);
router.put('/announcements/:id', verifyToken, updateAnnouncement);
router.delete('/announcements/:id', verifyToken, deleteAnnouncement);

export default router;