import express from 'express';
const router = express.Router();
import {
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
  getTotalBooksIssued,
  getIssuedBooks
} from '../controllers/bookController.js';

import { verifyToken } from '../middleware/verifyToken.js';

// Book routes
router.post('/books', addBook);
router.post('/books/issue', issueBook);
router.post('/books/return', returnBook);
router.get('/books', getBooks);
router.get('/books/available', getAvailableBooks);
router.get('/books/total', getTotalBooks);
router.get('/books/total/available', getTotalAvailableBooks);
router.get('/books/total/returned', getTotalBooksReturned);
router.get('/books/total/issued', getTotalBooksIssued);
router.get('/books/monthly/issued', getMonthlyIssuedBooks);
router.get('/books/issued', getIssuedBooks);
router.get('/students/:id/books', getBooksAssignedToStudent);
router.get('/books/:id/student', getStudentAssignedToBook);
router.put('/books/:id',  updateBook);
router.delete('/books/:id', deleteBook);

export default router;