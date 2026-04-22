import express from "express";
import {
    getLessons,
    getLessonById,
    createLesson,
    updateLesson,
    deleteLesson,
} from "../controllers/lesson.controller";
import { auth } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
const router = express.Router({ mergeParams: true }); //mergeParams: true ດຶງ params ມາໃຊ້

///api/courses/:courseId/lessons  :courseId=154655
router.get("/courses/:courseId/lessons", auth, getLessons);

router.get("/courses/:courseId/lessons/:lessonId", auth, getLessonById);

router.post(
    "/courses/:courseId/lessons",
    auth,
    authorizeRoles("instructor", "admin"),
    createLesson,
);

//http://localhost:3003/api/courses/<courseId>/lessons/<lessonId>
router.patch(
    "/courses/:courseId/lessons/:lessonId",
    auth,
    authorizeRoles("instructor", "admin"),
    updateLesson,
);

router.delete(
    "/courses/:courseId/lessons/:lessonId",
    auth,
    authorizeRoles("instructor", "admin"),
    deleteLesson,
);
export default router;
