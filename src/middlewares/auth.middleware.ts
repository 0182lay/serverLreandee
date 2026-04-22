import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. ຮັບ token key = Authorization
        const token = req.headers.authorization?.split(" ")[1];
        // 2. ເຊັກວ່າ token ມີບໍ່
        if (!token) {
            return res.status(401).json({ message: "ບໍ່ມີ Token" });
        }
        // 3. verify ຖອດລະຫັດ
        const decoded = jwt.verify(token, JWT_SECRET);
        // 4. เກັບຂໍ້ມູນ user ໄວ້ໃນ req
        (req as any).user = decoded;
        // 5. ຜ່ານໄປໄດ້
        return next();
        
    } catch (error) {
        console.log("something wrong in middleware");
        return res.status(401).json({ message: "Token ບໍ່ຖືກຕ້ອງ" });
    }
};
