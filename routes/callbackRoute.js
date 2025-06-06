import express from 'express';
import { handleMpesaCallback } from '../controllers/callbackController.js';

const callbackRoutes = express.Router();

callbackRoutes.post('/', handleMpesaCallback);

export default callbackRoutes;
