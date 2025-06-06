import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

// Get all students
export const getSubjects = async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subjects' });
    console.log(error)
  }
};

// Add a new student
export const addSubject = async (req, res) => {
  const { subjectName, subjectId } = req.body;

  if (!subjectName || !subjectId ) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newSubject = await prisma.subject.create({
      data: {
        subjectName,
        subjectId
      },
    });
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add student' });
  }
};

// Update a student
export const updateSubject = async (req, res) => {
  const { id } = req.params;
  const { subjectName, subjectId } = req.body;

  if (!subjectName || !subjectId) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const updatedStudent = await prisma.subject.update({
      where: { id },
      data: {
        subjectName,
        subjectId
      },
    });
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update student' });
  }
};

// Delete a student
export const deleteSubject = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.subject.delete({
      where: { id },
    });
    res.status(204).send(); // No content to send back
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete student' });
  }
};

export default {
  getSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
};