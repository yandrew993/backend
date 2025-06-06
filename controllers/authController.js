import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register a new user (Student or Teacher)
export const registerUser = async (req, res) => {
  const { name, userId, password, role } = req.body;

  if (!name || !userId || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (role !== "student" && role !== "teacher") {
    return res.status(400).json({ error: "Invalid role. Must be 'student' or 'teacher'" });
  }

  try {
    // Check if user already exists
    const existingUser =
      role === "student"
        ? await prisma.student.findUnique({ where: { studentId: userId } })
        : await prisma.teacher.findUnique({ where: { teacherId: userId } });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    if (role === "student") {
      newUser = await prisma.student.create({
        data: { name, studentId: userId, password: hashedPassword, role },
      });
    } else {
      newUser = await prisma.teacher.create({
        data: { name, teacherId: userId, password: hashedPassword, role },
      });
    }

    res.status(201).json({ message: `${role} registered successfully` });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
    console.error(error);
  }
};

// Login for both Students and Teachers
export const loginUser = async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ error: "UserId and password are required" });
  }

  try {
    // Find user in both student and teacher tables
    let user = await prisma.student.findUnique({ where: { studentId: userId } });

    if (!user) {
      user = await prisma.teacher.findUnique({ where: { teacherId: userId } });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Determine user role
    const role = user.studentId ? "student" : "teacher";

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    // Send user data including role
    res.status(200).json({ user: { ...user, role }, token });
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
    console.error(error);
  }
};

export default {
  registerUser,
  loginUser,
};
