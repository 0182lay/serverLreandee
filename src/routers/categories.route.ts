import express from "express";
import { auth } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../controllers/categories.controller";

const router = express.Router();

router.get("/category", auth, getCategories);
router.get("/category/:categoryId", auth, getCategoryById);
router.post(
    "/category",
    auth,
    authorizeRoles("instructor", "admin"),
    createCategory,
);
router.put(
    "/category/:categoryId",
    auth,
    authorizeRoles("instructor", "admin"),
    updateCategory,
);
router.delete(
    "/category/:categoryId",
    auth,
    authorizeRoles("instructor", "admin"),
    deleteCategory,
);

export default router;
