import express from "express";
import {
    getUsers,
    getById,
    updateUser,
    deleteUser,
} from "../controllers/users.controller";

import { auth } from "../middlewares/auth.middleware";


const router = express.Router();

router.get("/users", auth, getUsers);
router.get("/users/:userId", auth, getById);
router.put("/users/:userId", auth, updateUser);
router.delete("/users/:userId", auth, deleteUser);

export default router;
