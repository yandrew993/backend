import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const addBook = async (req, res) => {
  const {bookId, title, subject} = req.body;
  try {
    const book = await prisma.book.create({
      data: {
        bookId,
        title,
        subject,
        available: true,
      },
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getBooks = async (req, res) => {
  try {
    const books = await prisma.book.findMany();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Total number of books in the library
export const getTotalBooks = async (req, res) => {
    try {
      const totalBooks = await prisma.book.count();
      res.json({ totalBooks });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get available books in the library
export const getAvailableBooks = async (req, res) => {
    try {
      const availableBooks = await prisma.book.findMany({
        where: { available: true },
      });
      res.json(availableBooks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //Total available books in the library
export const getTotalAvailableBooks = async (req, res) => {
    try {
      const totalAvailable = await prisma.book.count({
        where: { available: true },
      });
      res.json({ totalAvailable });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //Total number of books returned
export const getTotalBooksReturned = async (req, res) => {
    try {
      const totalReturned = await prisma.bookIssue.count({
        where: { isReturned: true },
      });
      res.json({ totalReturned });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
   //get all issued books
export const getIssuedBooks = async (req, res) => {
    try {
      const issuedBooks = await prisma.bookIssue.findMany({
        where: { isReturned: false },
        include: {
          book: true,
          student: true,
        },
      });
      res.json(issuedBooks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // get Monthly issued books
  export const getMonthlyIssuedBooks = async (req, res) => {
    try {
      // Get the current year
      const currentYear = new Date().getFullYear();
  
      // Get all book issues for the current year
      const bookIssues = await prisma.bookIssue.findMany({
        where: {
          issueDate: {
            gte: new Date(`${currentYear}-01-01`), // Start of the year
            lt: new Date(`${currentYear + 1}-01-01`), // Start of the next year
          },
        },
        select: {
          issueDate: true,
        },
      });
  
      // Initialize an array with all months and their corresponding counts
      const monthlyStats = [
        { month: "January", count: 0 },
        { month: "February", count: 0 },
        { month: "March", count: 0 },
        { month: "April", count: 0 },
        { month: "May", count: 0 },
        { month: "June", count: 0 },
        { month: "July", count: 0 },
        { month: "August", count: 0 },
        { month: "September", count: 0 },
        { month: "October", count: 0 },
        { month: "November", count: 0 },
        { month: "December", count: 0 },
      ];
  
      // Count the number of issues for each month
      bookIssues.forEach((issue) => {
        const monthIndex = issue.issueDate.getMonth(); // JavaScript months are 0-indexed
        monthlyStats[monthIndex].count += 1; // Increment the count for the respective month
      });
  
      res.status(200).json(monthlyStats); // Return the grouped data for all months
    } catch (err) {
      console.error("Error getting monthly issued books stats:", err);
      res.status(500).json({ message: "Failed to get monthly issued books statistics" });
    }
  };

  // Total amount of books issued
export const getTotalBooksIssued = async (req, res) => {
    try {
      const totalIssued = await prisma.bookIssue.count({
        where: { isReturned: false },
      });
      res.json({ totalIssued });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  

  

export const issueBook = async (req, res) => {
    const { bookId, studentId } = req.body;
    try {
      const book = await prisma.book.findUnique({ where: { id: bookId } });
      if (!book || book.available===false) {
        return res.status(400).json({ error: 'Book not available' });
      }
  
      const issue = await prisma.bookIssue.create({
        data: {
          bookId,
          studentId,
          isReturned: false,
        },
      });
  
      await prisma.book.update({
        where: { id: bookId },
        data: { available: false },
      });
  
      res.status(201).json(issue);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };


  
  export const returnBook = async (req, res) => {
    const { issueId } = req.body;
    try {
      const issue = await prisma.bookIssue.update({
        where: { id: issueId },
        data: {
          isReturned: true,
          returnDate: new Date(),
        },
      });
  
      await prisma.book.update({
        where: { id: issue.bookId },
        data: { available: true },
      });
  
      res.json(issue);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  export const getBooksAssignedToStudent = async (req, res) => {
    const studentId = req.params.id;
  
    try {
      const issues = await prisma.bookIssue.findMany({
        where: {
          studentId,
          isReturned: false,
        },
        include: {
          book: true,
        },
      });
  
      const books = issues.map(issue => issue.book);
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Get the student currently assigned to a book
  export const getStudentAssignedToBook = async (req, res) => {
    const bookId = req.params.id;
  
    try {
      const issue = await prisma.bookIssue.findFirst({
        where: {
          bookId,
          isReturned: false,
        },
        include: {
          student: true,
        },
      });
  
      if (!issue) {
        return res.status(404).json({ message: "Book is not currently issued" });
      }
  
      res.json(issue.student);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };



// Update book details
export const updateBook = async (req, res) => {
  const { id } = req.params;
  const { bookId, title, subject } = req.body;
  try {
    const book = await prisma.book.update({
      where: { id },
      data: {
        bookId,
        title,
        subject,
      },
    });
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



export const deleteBook = async (req, res) => {
    const { id } = req.params;
    try {
      const book = await prisma.book.delete({
        where: { id },
      });
      res.json(book);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

 


// Export all functions for use in routes
export default {
  addBook,
  getBooks,
  getAvailableBooks,
  getTotalBooks,
  getTotalAvailableBooks,
  getTotalBooksReturned,
  getMonthlyIssuedBooks,
  issueBook,
  returnBook,
  getBooksAssignedToStudent,
  getStudentAssignedToBook,
  deleteBook,
  updateBook,
  getIssuedBooks,
  getTotalBooksIssued,
};