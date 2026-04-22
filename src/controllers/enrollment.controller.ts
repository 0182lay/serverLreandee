import { Request, Response } from "express";
import {
    getEnrollmentsService,
    enrollCourseService,
    cancelEnrollmentService,
} from "../services/enrollment.service";

export const getEnrollments = async (req: Request, res: Response) => {
    try {
        const student_id = (req as any).user?.user?.id;
        const enrollments = await getEnrollmentsService(student_id);
        return res
            .status(200)
            .json({ message: "ດຶງຂໍ້ມູນສຳເລັດ", data: enrollments });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            message: "ດຶງຂໍ້ມູນ Enrollment ບໍ່ສຳເັລດ",
        });
    }
};

export const enrollCourse = async (req: Request, res: Response) => {
    try {
        const student_id = (req as any).user?.user?.id;
        const { course_id } = req.body;

        const enrollment = await enrollCourseService(student_id, course_id);

        return res
            .status(201)
            .json({ message: "ລົງທະບຽນສຳເລັດ", data: enrollment });
    } catch (error: any) {
        if (error.message === "COURSE_NOT_FOUND") {
            return res.status(404).json({ message: "ບໍ່ພົບ Course" });
        }
        if (error.message === "COURSE_NOT_PUBLISHED") {
            return res.status(400).json({ message: "Course ຍັງບໍ່ໄດ້ເປີດສອນ" });
        }
        if (error.message === "ALREADY_ENROLLED") {
            return res.status(400).json({ message: "ລົງທະບຽນໄປແລ້ວ" });
        }
        return res.status(500).json({ message: "ລົງທະບຽນບໍ່ສຳເລັດ" });
    }
};

export const cancelEnrollment = async (req: Request, res: Response) => {
    try {
        const enrollmentId = req.params.enrollmentId as string;
        const student_id = (req as any).user?.user?.id;
        const userRole = (req as any).user?.user?.role;

        await cancelEnrollmentService(enrollmentId, student_id, userRole);

        return res.status(200).json({ message: "ຍົກເລີກການລົງທະບຽນສຳເລັດ" });
    } catch (error: any) {
        if (error.message === "ENROLLMENT_NOT_FOUND") {
            return res.status(404).json({ message: "ບໍ່ພົບ Enrollment" });
        }
        if (error.message === "FORBIDDEN") {
            return res.status(403).json({ message: "ບໍ່ມີສິດຍົກເລີກ" });
        }
        return res.status(500).json({ message: "ຍົກເລີກບໍ່ສຳເລັດ" });
    }
};
