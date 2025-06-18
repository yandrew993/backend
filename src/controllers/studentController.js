import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();



export const addStudent = async (req, res) => {
  const { name, studentId, password } = req.body;

  // Validate input
  if (!name || !studentId || !password) {
    console.warn("Validation Error: Missing required fields", { name, studentId, passwordPresent: !!password });
    return res.status(400).json({ error: 'All fields (name, studentId, password) are required' });
  }

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = await prisma.student.create({
      data: {
        name,
        studentId,
        password: hashedPassword,
        role: "student", // Automatically assigned
      },
    });

    res.status(201).json({ message: "Student created successfully", student: newStudent });

  } catch (error) {
    console.error("Database Error while adding student:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Student ID already exists' });
    }

    res.status(500).json({ error: 'Failed to add student' });
  }
};

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


// get teacher by id
export const getTeacherById = async (req, res) => {
  const { teacherId } = req.params;

  try {
    const teacher = await prisma.teacher.findUnique({
      where: { teacherId },
    });

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teacher' });
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
  getTeacherById,
  addStudent,
  updateStudent,
  deleteStudent,
};