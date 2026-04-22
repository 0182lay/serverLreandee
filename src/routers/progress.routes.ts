import express from "express";
import {
    getProgress,
    updateProgress,
} from "../controllers/progress.controller";
import { auth } from "../middlewares/auth.middleware";

const router = express.Router();
//http://localhost:3003/api/enrollments/<enrollmentId>/progress

router.get("/enrollments/:enrollmentId/progress", auth, getProgress);

router.patch(
    "/enrollments/:enrollmentId/progress/:lessonId",
    auth,
    updateProgress,
);

export default router;
