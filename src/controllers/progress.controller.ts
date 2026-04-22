import { Request, Response } from "express";
import {
    getProgressService,
    updateProgressService,
} from "../services/progress.service";

export const getProgress = async (req: Request, res: Response) => {
    try {
        const enrollmentId = req.params.enrollmentId as string;
        const student_id = (req as any).user?.user?.id;

        const progress = await getProgressService(enrollmentId, student_id);

        return res
            .status(200)
            .json({ message: "ດຶງຂໍ້ມູນສຳເລັດ", data: progress });
    } catch (error: any) {
        if (error.message === "ENROLLMENT_NOT_FOUND") {
            return res.status(404).json({ message: "ບໍ່ພົບ Enrollment" });
        }
        if (error.message === "FORBIDDEN") {
            return res.status(403).json({ message: "ບໍ່ມີສິດດູ Progress" });
        }
        return res
            .status(500)
            .json({ message: "ດຶງຂໍ້ມູນ Progress ບໍ່ສຳເລັດ" });
    }
};

export const updateProgress = async (req: Request, res: Response) => {
    try {
        const enrollmentId = req.params.enrollmentId as string;
        const lessonId = req.params.lessonId as string;
        const student_id = (req as any).user?.user?.id;
        const { watch_duration_seconds, is_completed } = req.body;

        const progress = await updateProgressService(
            enrollmentId,
            lessonId,
            student_id,
            { watch_duration_seconds, is_completed },
        );

        return res.status(200).json({
            message: "ອັບເດດ Progress ສຳເລັດ",
            data: progress,
        });
    } catch (error: any) {
        if (error.message === "ENROLLMENT_NOT_FOUND") {
            return res.status(404).json({ message: "ບໍ່ພົບ Enrollment" });
        }
        if (error.message === "LESSON_NOT_FOUND") {
            return res.status(404).json({ message: "ບໍ່ພົບ Lesson" });
        }
        if (error.message === "FORBIDDEN") {
            return res.status(403).json({ message: "ບໍ່ມີສິດອັບເດດ Progress" });
        }
        return res.status(500).json({ message: "ອັບເດດ Progress ບໍ່ສຳເລັດ" });
    }
};
