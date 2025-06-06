// src/controllers/paymentController.ts

import prisma from '../lib/prisma.js';

export const getSuccessfulPaymentsTotal = async (req, res) => {
  try {
    const { studentId } = req.params;

    
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }

    // Get all successful payments for the student
    const successfulPayments = await prisma.fees.findMany({
      where: {
        studentId,
        status: 'SUCCESS'
      },
      orderBy: {
        date: 'desc' // Optional: sort by date descending
      }
    });

    // Calculate total paid
    const totalPaid = successfulPayments.reduce(
      (sum, payment) => sum + payment.amount, 
      0
    );

    // Get current balance (from the most recent successful payment)
    const currentBalance = successfulPayments[0]?.balance || 10000;

    res.status(200).json({
      success: true,
      totalPaid,
      currentBalance,
      transactions: successfulPayments,
      count: successfulPayments.length
    });

  } catch (error) {
    console.error('Error fetching successful payments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payment data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};