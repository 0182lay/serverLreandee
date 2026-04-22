import { Router } from "express";
import {
    getLessonFiles,
    createLessonFile,
    deleteLessonFile,
} from "../controllers/lessonFile.controller";
import { auth } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router({ mergeParams: true });

router.get("/lessons/:lessonId/files", auth, getLessonFiles);

router.post(
    "/lessons/:lessonId/files",
    auth,
    authorizeRoles("instructor", "admin"),
    createLessonFile,
);

router.delete(
    "/lessons/:lessonId/files/:fileId",
    auth,
    authorizeRoles("instructor", "admin"),
    deleteLessonFile,
);

export default router;
