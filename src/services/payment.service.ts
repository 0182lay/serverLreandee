import { prisma } from "../lib/prisma";
import { PaymentStatus } from "../../generated/prisma/client";

export const getPaymentsService = async (student_id: string) => {
    const payments = await prisma.payment.findMany({
        where: { student_id },
        include: {
            course: {
                include: {
                    category: true,
                    instructor: {
                        include: { profile: true },
                    },
                },
            },
        },
        orderBy: { created_at: "desc" },
    });

    return payments;
};

export const getPaymentByIdService = async (
    payment_id: string,
    student_id: string,
    userRole: string,
) => {
    const payment = await prisma.payment.findUnique({
        where: { payment_id },
        include: {
            course: true,
        },
    });

    if (!payment) throw new Error("PAYMENT_NOT_FOUND");

    // student ดูได้แค่ของตัวเอง
    if (userRole !== "admin" && payment.student_id !== student_id) {
        throw new Error("FORBIDDEN");
    }

    return payment;
};

export const createPaymentService = async (
    student_id: string,
    course_id: string,
    payment_method: string,
) => {
    // ເຂັກວ່າ course ມີຢູ່ແທ້ບໍ່
    const course = await prisma.course.findUnique({
        where: { course_id },
    });

    if (!course) throw new Error("COURSE_NOT_FOUND");

    // เช็คว่าลงทะเบียนแล้วไหม
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            student_id_course_id: { student_id, course_id },
        },
    });

    if (!enrollment) throw new Error("NOT_ENROLLED");

    // ເຊັກວ່າຈ່າຍແລ້ວ ຫຼື ຍັງ
    if (enrollment.is_paid) throw new Error("ALREADY_PAID");

    // ສ້າງ payment
    const payment = await prisma.payment.create({
        data: {
            student_id,
            course_id,
            amount: course.price,
            payment_method,
            status: "pending",
        },
    });

    return payment;
};

export const updatePaymentStatusService = async (
    payment_id: string,
    status: PaymentStatus,
) => {
    const payment = await prisma.payment.findUnique({
        where: { payment_id },
    });

    if (!payment) throw new Error("PAYMENT_NOT_FOUND");

    // อัปเดต payment status
    const updated = await prisma.payment.update({
        where: { payment_id },
        data: { status },
    });

    // ถ้า status เป็น completed → อัปเดต enrollment is_paid = true
    if (status === "completed") {
        await prisma.enrollment.update({
            where: {
                student_id_course_id: {
                    student_id: payment.student_id,
                    course_id: payment.course_id,
                },
            },
            data: { is_paid: true },
        });
    }

    return updated;
};
