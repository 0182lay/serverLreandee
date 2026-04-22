import type { Request, Response } from "express";
import { registerService, loginService } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, first_name, last_name } = req.body;

        // 1.validate
        if (!email) {
            return res.status(400).json({
                message: "ກະລຸນາໃສ່ອີເມວ!!!",
            });
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "ກະລຸນາໃສ່ລະຫັດຜ່ານ!!!",
            });
        }
        // 2.ເອີ້ນໃຊ້ service
        const user = await registerService(
            email,
            password,
            first_name,
            last_name,
        );
        return res.status(201).json({
            message: "ຜູ້ໃຊ້ລົງທະບຽນສຳເລັດແລ້ວ",
            // data: user,
        });
    } catch (error: any) {
        // 3. ຈັດການ error ຈາກ service
        if (error.message === "EMAIL_ALREADY_EXISTS") {
            return res.status(409).json({ message: "ອີເມວມີຢູ່ແລ້ວ" });
        }
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "ກະລຸນາໃສ່ອີເມວ!!!",
            });
        }
        if (!password) {
            return res.status(400).json({
                message: "ກະລຸນາໃສ່ລະຫັດຜ່ານ!!!",
            });
        }
        //ເອີ້ນໃຊ້ service
        const result = await loginService(email, password);

        return res.status(200).json({
            User: result.user,
            Token: result.token,
        });
    } catch (error: any) {
        //ຈັດການ error service
        if (error.message === "USER_NOT_FOUND") {
            return res.status(400).json({
                message: "ບໍ່ພົບຂໍ້ມູນກະລຸນາລົງທະບຽນ!!!",
            });
        }
        if (error.message === "INVALID_PASSWORD") {
            return res.status(400).json({ message: "ລະຫັດຜ່ານບໍ່ຕົງ!!!" });
        }
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
