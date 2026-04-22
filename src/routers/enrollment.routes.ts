import express from "express";
import {
    getEnrollments,
    enrollCourse,
    cancelEnrollment,
} from "../controllers/enrollment.controller";
import { auth } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/enrollments", auth, getEnrollments);

router.post("/enrollments", auth, enrollCourse);

router.delete("/enrollments/:enrollmentId", auth, cancelEnrollment);

export default router;
