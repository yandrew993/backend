import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get all announcements
export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany();
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
};

// Add a new announcement
export const addAnnouncement = async (req, res) => {
  const { title, content, teacherId } = req.body;

  if (!title || !content || !teacherId) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        content,
        teacherId,
      },
    });
    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add announcement' });
    console.log(error)
  }
};

// Update an announcement
export const updateAnnouncement = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const updatedAnnouncement = await prisma.announcement.update({
      where: { id },
      data: {
        title,
        content,
      },
    });
    res.status(200).json(updatedAnnouncement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update announcement' });
  }
};

// Delete an announcement
export const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.announcement.delete({
      where: { id },
    });
    res.status(204).send(); // No content to send back
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
};

export default {
  getAllAnnouncements,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};