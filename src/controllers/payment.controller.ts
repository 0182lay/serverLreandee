import { Request, Response } from "express";
import {
    getPaymentsService,
    createPaymentService,
    getPaymentByIdService,
    updatePaymentStatusService,
} from "../services/payment.service";

export const getPayments = async (req: Request, res: Response) => {
    try {
        const student_id = (req as any).user?.user?.id;
        const payments = await getPaymentsService(student_id);
        return res
            .status(200)
            .json({ message: "ດຶງຂໍ້ມູນສຳເລັດ", data: payments });
    } catch (error: any) {
        return res.status(500).json({ message: "ດຶງຂໍ້ມູນ Payment ບໍ່ສຳເລັດ" });
    }
};
export const getPaymentById = async (req: Request, res: Response) => {
    try {
        const paymentId = req.params.paymentId as string;
        const student_id = (req as any).user?.user?.id;
        const userRole = (req as any).user?.user?.role;

        const payment = await getPaymentByIdService(
            paymentId,
            student_id,
            userRole,
        );

        return res
            .status(200)
            .json({ message: "ດຶງຂໍ້ມູນສຳເລັດ", data: payment });
    } catch (error: any) {
        if (error.message === "PAYMENT_NOT_FOUND") {
            return res.status(404).json({ message: "ບໍ່ພົບ Payment" });
        }
        if (error.message === "FORBIDDEN") {
            return res.status(403).json({ message: "ບໍ່ມີສິດດູ Payment ນີ້" });
        }
        return res.status(500).json({ message: "ດຶງຂໍ້ມູນ Payment ບໍ່ສຳເລັດ" });
    }
};

export const createPayment = async (req: Request, res: Response) => {
    try {
        const student_id = (req as any).user?.user?.id;
        const { course_id, payment_method } = req.body;

        const payment = await createPaymentService(
            student_id,
            course_id,
            payment_method,
        );

        return res
            .status(201)
            .json({ message: "ສ້າງ Payment ສຳເລັດ", data: payment });
    } catch (error: any) {
        if (error.message === "COURSE_NOT_FOUND") {
            return res.status(404).json({ message: "ບໍ່ພົບ Course" });
        }
        if (error.message === "NOT_ENROLLED") {
            return res.status(400).json({ message: "ຕ້ອງລົງທະບຽນກ່ອນຈ່າຍ" });
        }
        if (error.message === "ALREADY_PAID") {
            return res.status(400).json({ message: "ຈ່າຍໄປແລ້ວ" });
        }
        return res.status(500).json({ message: "ສ້າງ Payment ບໍ່ສຳເລັດ" });
    }
};

export const updatePaymentStatus = async (req: Request, res: Response) => {
    try {
        const paymentId = req.params.paymentId as string;
        const { status } = req.body;

        const payment = await updatePaymentStatusService(paymentId, status);

        return res.status(200).json({
            message: "ອັບເດດ Payment ສຳເລັດ",
            data: payment,
        });
    } catch (error: any) {
        if (error.message === "PAYMENT_NOT_FOUND") {
            return res.status(404).json({ message: "ບໍ່ພົບ Payment" });
        }
        return res.status(500).json({ message: "ອັບເດດ Payment ບໍ່ສຳເລັດ" });
    }
};
