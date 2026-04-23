import express from "express";
import {
    getPayments,
    createPayment,
    getPaymentById,
    updatePaymentStatus,
} from "../controllers/payment.controller";
import { auth } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = express.Router();

router.get("/payments", auth, getPayments);

router.get("/payments/:paymentId", auth, getPaymentById);

router.post("/payments", auth, createPayment);

router.patch(
    "/payments/:paymentId/status",
    auth,
    authorizeRoles("admin"),
    updatePaymentStatus,
);

export default router;
