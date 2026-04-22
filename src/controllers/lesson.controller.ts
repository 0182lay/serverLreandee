import { Request, Response } from "express";
import {
    getLessonsService,
    getLessonByIdService,
    createLessonService,
    updateLessonService,
    deleteLessonService,
} from "../services/lesson.service";

export const getLessons = async (req: Request, res: Response) => {
    try {
        const courseId = req.params.courseId as string;
        const lessons = await getLessonsService(courseId);
        return res.status(200).json({
            message: "ດຶງຂໍ້ມູນສຳເັລດ",
            data: lessons,
        });
    } catch (error: any) {
        if (error.message === "COURSE_NOT_FOUND") {
            return res.status(404).json({ message: "ບໍ່ພົບ Course" });
        }
        console.log(error);
        return res.status(500).json({ message: "ດຶງຂໍ້ມູນ Lesson ບໍ່ສຳເລັດ" });
    }
};

export const getLessonById = async (req: Request, res: Response) => {
    try {
        const courseId = req.params.courseId as string;
        const lessonId = req.params.lessonId as string;
        const lesson = await getLessonByIdService(courseId, lessonId);
        return res.status(200).json({
            message: "ດຶງຂໍ້ມູນສຳເລັດ ",
            data: lesson,
        });
    } catch (error: any) {
        console.log(error);
        if (error.message === "LESSON_NOT_FOUND") {
            return res.status(404).json({
                message: "ບໍ່ພົບ Lesson",
            });
        }
        return res.status(500).json({
            message: "ດຶງຂໍ້ມູນ Lesson ບໍ່ສຳເລັດ",
        });
    }
};

export const createLesson = async (req: Request, res: Response) => {
    try {
        const courseId = req.params.courseId as string;
        const instructor_id = (req as any).user?.user?.id;
        const { title, description, order_index, is_free_preview } = req.body;
        const lesson = await createLessonService(courseId, instructor_id, {
            title,
            description,
            order_index,
            is_free_preview,
        });
        return res
            .status(201)
            .json({ message: "ສ້າງ Lesson ສຳເລັດ", data: lesson });
    } catch (error: any) {
        console.log(error);
        if (error.message === "COURSE_NOT_FOUND") {
            return res.status(404).json({ message: "ບໍ່ພົບ Course" });
        }
        if (error.message === "FORBIDDEN") {
            return res.status(403).json({ message: "ບໍ່ມີສິດສ້າງ Lesson" });
        }
        return res.status(500).json({ message: "ສ້າງ Lesson ບໍ່ສຳເລັດ" });
    }
};

export const updateLesson = async (req: Request, res: Response) => {
    try {
        const courseId = req.params.courseId as string;
        const lessonId = req.params.lessonId as string;
        const instructor_id = (req as any).user?.user?.id;
        const userRole = (req as any).user?.user?.role;
        const { title, description, order_index, is_free_preview } = req.body;

        const lesson = await updateLessonService(
            courseId,
            lessonId,
            instructor_id,
            userRole,
            { title, description, order_index, is_free_preview },
        );
        return res.status(200).json({ message: "ອັບເດດ Lesson ສຳເລັດ", data: lesson });
    } catch (error: any) {
        console.log(error);
        if (error.message === "LESSON_NOT_FOUND") {
            return res.status(404).json({ message: "ບໍ່ພົບ Lesson" });
        }
        if (error.message === "FORBIDDEN") {
            return res.status(403).json({ message: "ບໍ່ມີສິດແກ້ໄຂ Lesson" });
        }
        return res.status(500).json({ message: "ອັບເດດ Lesson ບໍ່ສຳເລັດ" });
    }
};

export const deleteLesson = async (req: Request, res: Response) => {
    try {
        const courseId = req.params.courseId as string;
        const lessonId = req.params.lessonId as string;
        const instructor_id = (req as any).user?.user?.id;
        const userRole = (req as any).user?.user?.role;

        await deleteLessonService(courseId, lessonId, instructor_id, userRole);
        return res.status(200).json({ message: "ລົບ Lesson ສຳເລັດ" });
    } catch (error: any) {
        console.log(error);
        if (error.message === "LESSON_NOT_FOUND") {
            return res.status(404).json({ message: "ບໍ່ພົບ Lesson" });
        }
        if (error.message === "FORBIDDEN") {
            return res.status(403).json({ message: "ບໍ່ມີສິດລົບ Lesson" });
        }
        return res.status(500).json({ message: "ລົບ Lesson ບໍ່ສຳເລັດ" });
    }
};
