import express from 'express';
import { waitingPayment } from '../controllers/waitingController.js';

const waitingRoute = express.Router();

waitingRoute.post('/', waitingPayment);

export default waitingRoute;