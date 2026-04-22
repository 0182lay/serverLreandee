import { Request, Response, NextFunction } from "express";

export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = (req as any).user?.user?.role; // ← แก้ตรงนี้

        if (!userRole) {
            return res.status(403).json({ message: "ບໍ່ພົບຂໍ້ມູນ Role" });
        }

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: "ບໍ່ມີສິດໃຊ້ງານ" });
        }

        next();
    };
};
