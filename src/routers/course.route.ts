import { Router } from "express";
import {
    getCourses,
    getCoursesById,
    createCourse,
    updateCourse,
    deleteCourse,
} from "../controllers/course.controller";
import { auth } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const router = Router();

router.get("/courses", auth, getCourses);
router.get("/courses/:courseId", auth, getCoursesById);
router.post(
    "/courses",
    auth,
    authorizeRoles("instructor", "admin"),
    createCourse,
);
router.patch(
    "/courses/:courseId",
    auth,
    authorizeRoles("instructor", "admin"),
    updateCourse,
);
router.delete(
    "/courses/:courseId",
    auth,
    authorizeRoles("instructor", "admin"),
    deleteCourse,
);

export default router;
