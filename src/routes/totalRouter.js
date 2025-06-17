import express from 'express'
import { getSuccessfulPaymentsTotal } from '../controllers/totalController.js';

const totalRoute = express.Router()

totalRoute.get('/amount/:studentId',getSuccessfulPaymentsTotal);

export default totalRoute
