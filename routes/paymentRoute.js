import express from "express";
import { payment } from "../controllers/paymentController.js";

const paymentRoute = express.Router();

paymentRoute.post("/", payment );

export default paymentRoute;