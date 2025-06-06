import prisma from "../lib/prisma.js"

export const getFeeByStudentId = async (req, res) => {
    const { studentId } = req.params;
  
    try {
      const results = await prisma.fees.findMany({
        where: { studentId },
      });
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fee payments" });
      console.log(error)
    }
  };

export const updatePaymentStatus = async (req, res) => {
  try {
    const { checkoutRequestId } = req.params;
    const { status, balance } = req.body;

    // Validate inputs
    if (!checkoutRequestId) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID is required'
      });
    }

    if (!status || !['SUCCESS', 'FAILED', 'PENDING'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (SUCCESS, FAILED, PENDING)'
      });
    }

    // Update the payment status
    const updatedPayment = await prisma.fees.update({
      where: {
        checkoutRequestId,
      },
      data: {
        status,
        ...(balance !== undefined && { balance }) // Optional balance update
      },
      select: {
        id: true,
        studentId: true,
        amount: true,
        status: true,
        balance: true,
        date: true,
        checkoutRequestId: true
      }
    });

    // If status is SUCCESS, update student's balance (example)
    if (status === 'SUCCESS') {
      await prisma.student.update({
        where: { id: updatedPayment.studentId },
        data: { 
          balance: updatedPayment.balance 
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      payment: updatedPayment
    });

  } catch (error) {
    console.error('Error updating payment status:', error);
    
    // Handle Prisma not found error
    // if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Payment record not found'
    //   });
    // }

    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};