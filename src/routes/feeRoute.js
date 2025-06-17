import express from "express"
import { getFeeByStudentId, updatePaymentStatus } from "../controllers/feeController.js"

const feeRoute = express.Router()
feeRoute.get('/fee/:studentId', getFeeByStudentId)
feeRoute.put("/fee/:checkoutRequestId", updatePaymentStatus)

export default feeRoute