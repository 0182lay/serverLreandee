import { Request, Response } from "express";
import {
    getCoursesService,
    getCoursesByIdService,
    createCourseService,
    updateCourseService,
    deleteCourseService,
} from "../services/course.service";

export const getCourses = async (req: Request, res: Response) => {
    try {
        const courses = await getCoursesService();
        res.status(200).json({
            message: "ດຶງຂໍ້ມູນສຳເັລດ",
            data: courses,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "ດຶງຂໍ້ມູນ Courses ບໍ່ສຳເລັດ" });
    }
};

export const getCoursesById = async (req: Request, res: Response) => {
    try {
        const courseId = req.params.courseId as string;
        const course = await getCoursesByIdService(courseId);

        res.status(200).json({
            message: "ດຶງຂໍ້ມູນສຳເັລດ",
            data: course,
        });
    } catch (error: any) {
        if (error.message === "COURSE_NOT_FOUND") {
            return res.status(404).json({
                message: "ບໍ່ພົບ course",
            });
        }
        console.log(error);
        res.status(500).json({
            message: " ດຶງຂໍ້ມູນ Course ບໍ່ສຳເລັດ ",
        });
    }
};

export const createCourse = async (req: Request, res: Response) => {
    try {
        const instructor_id = (req as any).user?.user?.id;
        const { category_id, title, description, price } = req.body;

        const course = await createCourseService(
            instructor_id,
            category_id,
            title,
            description,
            price,
        );

        res.status(201).json({
            message: "ສ້າງ Course ສຳເັລດ",
            data: course,
        });
    } catch (error: any) {
        if (error.message === "CATEGORY_NOT_FOUND") {
            return res.status(404).json({
                message: "ບໍ່ພົບ Category ",
            });
        }
        res.status(500).json({
            message: "ສ້າງ Course ບໍ່ສຳເລັດ",
        });
    }
};

export const updateCourse = async (req: Request, res: Response) => {
    try {
        const courseId = req.params.courseId as string;
        const instructor_id = (req as any).user?.user?.id;
        const userRole = (req as any).user?.user?.role;
        const { category_id, title, description, price } = req.body;
        const course = await updateCourseService(
            courseId,
            instructor_id,
            userRole,
            {
                category_id,
                title,
                description,
                price,
            },
        );
        res.status(200).json({
            message: "ອັບເດດ Course ສຳເລັດ ",
            data: course,
        });
    } catch (error: any) {
        if (error.message === "COURSE_NOT_FOUND") {
            return res.status(404).json({
                message: "ບໍ່ພົບ Course",
            });
        }
        if (error.message === "FORBIDDEN") {
            return res.status(403).json({
                message: " ບໍ່ມີສິດແກ້ໄຂ Course ນີ້",
            });
        }
        res.status(500).json({
            message: "ອັບເດດ Course  ບໍ່ສຳເລັດ",
        });
    }
};

export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const courseId = req.params.courseId as string;
        const instructor_id = (req as any).user?.user?.id;
        const userRole = (req as any).user.user?.role;

        await deleteCourseService(courseId, instructor_id, userRole);

        res.status(200).json({
            message: "ລົບ Course ສຳເລັດ",
        });
    } catch (error: any) {
        if (error.message === "COURSE_NOT_FOUND") {
            return res.status(404).json({ message: "ບໍ່ພົບ Course" });
        }
        if (error.message === "FORBIDDEN") {
            return res.status(403).json({ message: "ບໍ່ມີສິດລົບ Course ນີ້" });
        }
        res.status(500).json({ message: "ລົບ Course ບໍ່ສຳເລັດ" });
    }
};
