import { Request, Response } from "express";
import {
    getReviewsService,
    createReviewService,
    updateReviewService,
    deleteReviewService,
} from "../services/review.service";

export const getReviews = async (req: Request, res: Response) => {
    try {
        const courseId = req.params.courseId as string;
        const reviews = await getReviewsService(courseId);
        return res
            .status(200)
            .json({ message: "ດຶງຂໍ້ມູນສຳເລັດ", data: reviews });
    } catch (error: any) {
        if (error.message === "COURSE_NOT_FOUND") {
            return res.status(404).json({ message: "ບໍ່ພົບ Course" });
        }
        return res.status(500).json({ message: "ດຶງຂໍ້ມູນ Review ບໍ່ສຳເລັດ" });
    }
};

export const createReview = async (req: Request, res: Response) => {
    try {
        const courseId = req.params.courseId as string;
        const student_id = (req as any).user?.user?.id;
        const { rating, comment } = req.body;

        const review = await createReviewService(courseId, student_id, {
            rating,
            comment,
        });

        return res.status(201).json({ message: "ຣີວິວສຳເລັດ", data: review });
    } catch (error: any) {
        if (error.message === "COURSE_NOT_FOUND") {
            return res.status(404).json({ message: "ບໍ່ພົບ Course" });
        }
        if (error.message === "NOT_ENROLLED") {
            return res.status(400).json({ message: "ຕ້ອງລົງທະບຽນກ່ອນຣີວິວ" });
        }
        if (error.message === "ALREADY_REVIEWED") {
            return res.status(400).json({ message: "ຣີວິວໄປແລ້ວ" });
        }
        if (error.message === "INVALID_RATING") {
            return res
                .status(400)
                .json({ message: "Rating ຕ້ອງຢູ່ລະຫວ່າງ 1-5" });
        }
        return res.status(500).json({ message: "ຣີວິວບໍ່ສຳເລັດ" });
    }
};

export const updateReview = async (req: Request, res: Response) => {
    try {
        const reviewId = req.params.reviewId as string;
        const student_id = (req as any).user?.user?.id;
        const userRole = (req as any).user?.user?.role;
        const { rating, comment } = req.body;

        const review = await updateReviewService(
            reviewId,
            student_id,
            userRole,
            {
                rating,
                comment,
            },
        );

        return res
            .status(200)
            .json({ message: "ອັບເດດ Review ສຳເລັດ", data: review });
    } catch (error: any) {
        if (error.message === "REVIEW_NOT_FOUND") {
            return res.status(404).json({ message: "ບໍ່ພົບ Review" });
        }
        if (error.message === "FORBIDDEN") {
            return res.status(403).json({ message: "ບໍ່ມີສິດແກ້ໄຂ Review" });
        }
        if (error.message === "INVALID_RATING") {
            return res
                .status(400)
                .json({ message: "Rating ຕ້ອງຢູ່ລະຫວ່າງ 1-5" });
        }
        return res.status(500).json({ message: "ອັບເດດ Review ບໍ່ສຳເລັດ" });
    }
};

export const deleteReview = async (req: Request, res: Response) => {
    try {
        const reviewId = req.params.reviewId as string;
        const student_id = (req as any).user?.user?.id;
        const userRole = (req as any).user?.user?.role;

        await deleteReviewService(reviewId, student_id, userRole);

        return res.status(200).json({ message: "ລົບ Review ສຳເລັດ" });
    } catch (error: any) {
        if (error.message === "REVIEW_NOT_FOUND") {
            return res.status(404).json({ message: "ບໍ່ພົບ Review" });
        }
        if (error.message === "FORBIDDEN") {
            return res.status(403).json({ message: "ບໍ່ມີສິດລົບ Review" });
        }
        return res.status(500).json({ message: "ລົບ Review ບໍ່ສຳເລັດ" });
    }
};
