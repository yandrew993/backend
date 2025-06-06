import axios from "axios";
import prisma from "../lib/prisma.js";

const getAccessToken = async () => {
  const auth = Buffer.from(
    `${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`
  ).toString("base64");

  try {
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error getting access token:",
      error?.response?.data || error.message
    );
    throw new Error("Failed to get access token");
  }
};

export const waitingPayment = async (req, res) => {
  const { CheckoutRequestID, studentId, amount } = req.body;

  if (!CheckoutRequestID || !studentId || !amount) {
    return res.status(400).json({ 
      error: "CheckoutRequestID, studentId, and amount are required" 
    });
  }

  try {
    if (!process.env.BUSINESS_SHORTCODE || !process.env.PASSKEY) {
      return res.status(500).json({
        error: "Server configuration error. Missing environment variables.",
      });
    }

    const token = await getAccessToken();
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.]/g, "")
      .slice(0, 14);
    const password = Buffer.from(
      `${process.env.BUSINESS_SHORTCODE}${process.env.PASSKEY}${timestamp}`
    ).toString("base64");

    const requestBody = {
      BusinessShortCode: process.env.BUSINESS_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID,
    };

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",
      requestBody,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const { ResponseCode, ResultCode, ResultDesc } = response.data;

    // Fetch the last payment record of the student
    const lastPayment = await prisma.fees.findFirst({
      where: { studentId },
      orderBy: { date: "desc" },
    });

    // Set default balance to 10000 if no record exists or balance is null
    const DEFAULT_BALANCE = 10000;
    const lastBalance = lastPayment?.balance !== null && lastPayment?.balance !== undefined 
      ? lastPayment.balance 
      : DEFAULT_BALANCE;
    
    const newBalance = lastBalance - Number(amount);

    if (ResponseCode === "0" && ResultCode === "0") {
      // Payment successful
      const paymentRecord = await prisma.fees.create({
        data: {
          studentId,
          amount: Number(amount),
          checkoutRequestId: CheckoutRequestID,
          balance: newBalance,
          status: "SUCCESS",
        },
      });

      return res.status(200).json({ 
        success: true, 
        message: "Payment successful", 
        balance: newBalance,
        paymentId: paymentRecord.id 
      });
    } else {
      // Payment failed
      await prisma.fees.create({
        data: {
          studentId,
          amount: Number(amount),
          checkoutRequestId: CheckoutRequestID,
          balance: lastBalance, // Keep the same balance
          status: "FAILED",
          //remarks: ResultDesc || "Payment not completed",
        },
      });

      return res.status(400).json({
        success: false,
        message: ResultDesc || "Payment not successful",
        balance: lastBalance,
      });
    }
  } catch (error) {
    console.error("Error checking payment status:", error?.response?.data || error.message);
    
    // Attempt to save the error information
    // try {
    //   await prisma.fees.create({
    //     data: {
    //       studentId,
    //       amount: Number(amount),
    //       checkoutRequestId: CheckoutRequestID,
    //       balance: 10000, // Fallback to default balance on error
    //       status: "ERROR",
    //       //remarks: error.message.substring(0, 255), // Truncate if too long
    //     },
    //   });
    // } catch (dbError) {
    //   console.error("Failed to save error record:", dbError);
    // }

    res.status(500).json({
      error: "Failed to check payment status",
      details: error?.response?.data || error.message,
    });
  }
};