import express from "express";
import {
    getReviews,
    createReview,
    updateReview,
    deleteReview,
} from "../controllers/review.controller";
import { auth } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/courses/:courseId/reviews", auth, getReviews);

router.post("/courses/:courseId/reviews", auth, createReview);

router.patch("/courses/:courseId/reviews/:reviewId", auth, updateReview);

router.delete("/courses/:courseId/reviews/:reviewId", auth, deleteReview);

export default router;
