import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
    console.log(error)
  }
};
//Get total number of students
export const getTotalStudents = async (req, res) => {
  try {
    const totalStudents = await prisma.student.count();
    res.status(200).json({ totalStudents });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch total students' });
  }
};

// Total students given books
export const getTotalStudentsWithBooks = async (req, res) => {
  try {
    const totalStudentsWithBooks = await prisma.bookIssue.count({
      where: { isReturned: false },
    });
    res.status(200).json({ totalStudentsWithBooks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch total students with books' });
  }
};

// Add a new student
export const addStudent = async (req, res) => {
  const { name, studentId, age, grade } = req.body;

  if (!name || !studentId || !age || !grade) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newStudent = await prisma.student.create({
      data: {
        name,
        studentId,
        age,
        grade,
      },
    });
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add student' });
  }
};

// Update a student
export const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, studentId, age, grade } = req.body;

  if (!name || !studentId || !age || !grade) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        name,
        studentId,
        age,
        grade,
      },
    });
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update student' });
  }
};

// Delete a student
export const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.student.delete({
      where: { id },
    });
    res.status(204).send(); // No content to send back
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete student' });
  }
};



export default {
  getAllStudents,
  getTotalStudents,
  getTotalStudentsWithBooks,
  addStudent,
  updateStudent,
  deleteStudent,
};