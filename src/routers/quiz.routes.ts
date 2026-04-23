import express from "express";
import {
    getQuiz,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    submitQuiz,
    getQuizResult,
} from "../controllers/quiz.controller";
import { auth } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = express.Router();

router.get("/lessons/:lessonId/quiz", auth, getQuiz);
router.post(
    "/lessons/:lessonId/quiz",
    auth,
    authorizeRoles("instructor", "admin"),
    createQuiz,
);
router.patch(
    "/lessons/:lessonId/quiz",
    auth,
    authorizeRoles("instructor", "admin"),
    updateQuiz,
);
router.delete(
    "/lessons/:lessonId/quiz",
    auth,
    authorizeRoles("instructor", "admin"),
    deleteQuiz,
);

router.post("/lessons/:lessonId/quiz/submit", auth, submitQuiz);

router.get("/lessons/:lessonId/quiz/result", auth, getQuizResult);

export default router;
