import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const handleMpesaCallback = async (req, res) => {
    try {
        console.log("MPESA CALLBACK RECEIVED:", req.body);

        // Extract required data from response
        const callbackData = req.body;

        // Check if request contains the expected structure
        if (!callbackData.Body || !callbackData.Body.stkCallback) {
            return res.status(400).json({ error: "Invalid callback format" });
        }

        const { stkCallback } = callbackData.Body;

        // Extract relevant details
        const { ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

        if (ResultCode === 0) {
            // Payment was successful
            const amount = CallbackMetadata.Item.find(item => item.Name === "Amount")?.Value;
            const transactionId = CallbackMetadata.Item.find(item => item.Name === "MpesaReceiptNumber")?.Value;
            const phone = CallbackMetadata.Item.find(item => item.Name === "phone")?.Value;
            const currency = CallbackMetadata.Item.find(item => item.Name === "currency")?.Value;
            const timestamp = CallbackMetadata.Item.find(item => item.Name === "timestamp")?.Value;
            const studentId = CallbackMetadata.Item.find(item => item.Name === "studentId")?.Value;

            // Save transaction to the database using Prisma
            await prisma.payment.create({
                data: {
                    phone,
                    currency,
                    amount,
                    transactionId,
                    studentId,
                    timestamp,
                    status: "Success"
                }
            });

            console.log("Payment Successful:", { transactionId, amount, phone });
            return res.status(200).json({ message: "Payment successful", transactionId, amount, phone });
        } else {
            // Payment failed
            console.log("Payment Failed:", ResultDesc);
            return res.status(400).json({ error: "Payment failed", description: ResultDesc });
        }

    } catch (error) {
        console.error("Error handling callback:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
