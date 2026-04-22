import { Request, Response } from "express";
import {
    getLessonFilesService,
    createLessonFileService,
    deleteLessonFileService,
} from "../services/lessonFile.service";

export const getLessonFiles = async (req: Request, res: Response) => {
    try {
        const lessonId = req.params.lessonId as string;
        const files = await getLessonFilesService(lessonId);
        return res
            .status(200)
            .json({ message: "ດຶງຂໍ້ມູນສຳເລັດ", data: files });
    } catch (error: any) {
        console.log(error);
        if (error.message === "LESSON_NOT_FOUND") {
            return res.status(404).json({ message: "ບໍ່ພົບ Lesson" });
        }
        return res.status(500).json({ message: "ດຶງຂໍ້ມູນ File ບໍ່ສຳເລັດ" });
    }
};

export const createLessonFile = async (req: Request, res: Response) => {
    try {
        const lessonId = req.params.lessonId as string;
        const instructor_id = (req as any).user?.user?.id;
        const {
            file_type,
            file_url,
            original_name,
            duration_seconds,
            size_bytes,
            order_index,
        } = req.body;

        const file = await createLessonFileService(lessonId, instructor_id, {
            file_type,
            file_url,
            original_name,
            duration_seconds,
            size_bytes,
            order_index,
        });
        return res
            .status(201)
            .json({ message: "ສ້າງ File ສຳເລັດ", data: file });
    } catch (error: any) {
        console.log(error);
        if (error.message === "LESSON_NOT_FOUND") {
            return res.status(404).json({ message: "ບໍ່ພົບ Lesson" });
        }
        if (error.message === "FORBIDDEN") {
            return res.status(403).json({ message: "ບໍ່ມີສິດສ້າງ File" });
        }
        return res.status(500).json({ message: "ສ້າງ File ບໍ່ສຳເລັດ" });
    }
};

export const deleteLessonFile = async (req: Request, res: Response) => {
    try {
        const fileId = req.params.fileId as string;
        const instructor_id = (req as any).user?.user?.id;
        const userRole = (req as any).user?.user?.role;

        await deleteLessonFileService(fileId, instructor_id, userRole);

        return res.status(200).json({
            message: "ລົບ file ສຳເລັດ",
        });
    } catch (error: any) {
        console.log(error);
        if (error.message === "FILE_NOT_FOUND") {
            return res.status(404).json({ message: "ບໍ່ພົບ File" });
        }
        if (error.message === "FORBIDDEN") {
            return res.status(403).json({ message: "ບໍ່ມີສິດລົບ File" });
        }
        return res.status(500).json({ message: "ລົບ File ບໍ່ສຳເລັດ" });
    }
};
