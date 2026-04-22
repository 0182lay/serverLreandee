import { Request, Response } from "express";
import {
    getUsersService,
    getByIdService,
    updateUserService,
    deleteUserService,
} from "../services/users.service";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await getUsersService();

        return res.status(200).json({ data: users });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "server error",
        });
    }
};
export const getById = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId as string;

        const user = await getByIdService(userId);

        // ຕັດ password_hash ອອກກ່ອນ return

        return res.status(200).json({
            data: user,
        });
    } catch (error: any) {
        if (error.message === "USER_NOT_FOUND") {
            return res.status(404).json({
                message: "ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້",
            });
        }
        console.log(error);
        return res.status(500).json({
            message: "server error",
        });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId as string;
        const { email, first_name, last_name, avatar_url, bio, phone } =
            req.body;
        const updated = await updateUserService(userId, {
            email,
            first_name,
            last_name,
            avatar_url,
            bio,
            phone,
        });

        return res.status(200).json({
            message: "ອັບເດດສຳເລັດ!!!",
            data: updated,
        });
    } catch (error: any) {
        if (error.message === "USER_NOT_FOUND") {
            return res.status(404).json({
                message: "ບໍ່ພົບຜູ້ໃຊ້ງານ",
            });
        }
        console.log(error);
        return res.status(500).json({
            message: "server error",
        });
    }
};
//DELETE http://localhost:3000/users/abc-1234-uuid =>ແມ່ນ params
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId as string; // ← ບອກ TypeScript ວ່າເປັນ string

        await deleteUserService(userId);

        return res.status(200).json({
            message: "ລົບຜູ້ໃຊ້ສຳເລັດແລ້ວ",
        });
    } catch (error: any) {
        if (error.message === "USER_NOT_FOUND") {
            return res.status(404).json({
                message: "ບໍ່ພົບຜູ້ໃຊ້",
            });
        }
        console.log(error);
        return res.status(500).json({
            message: "server error",
        });
    }
};
