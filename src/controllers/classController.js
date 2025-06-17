import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

// Get all students
export const getClasses = async (req, res) => {
  try {
    const students = await prisma.class.findMany();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch classes' });
    console.log(error)
  }
};

// Add a new student
export const addClass = async (req, res) => {
  const { className } = req.body;

  if (!className) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newClass = await prisma.class.create({
      data: {
        className
      },
    });
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add class' });
  }
};

// Update a student
export const updateClass = async (req, res) => {
  const { id } = req.params;
  const { className } = req.body;

  if (!className) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        className
      },
    });
    res.status(200).json(updatedClass);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update class' });
  }
};

// Delete a student
export const deleteClass = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.class.delete({
      where: { id },
    });
    res.status(204).send(); // No content to send back
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete class' });
  }
};

export default {
  getClasses,
  addClass,
  updateClass,
  deleteClass
};