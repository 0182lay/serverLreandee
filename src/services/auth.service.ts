import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const registerService = async (
    email: string,
    password: string,
    first_name: string,
    last_name: string,
) => {
    // 1. ເຊັກອີເມວຊຳ້ in DB
    const checkUser = await prisma.user.findUnique({ where: { email } });
    if (checkUser) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // 3. ສ້າງ user
    const newUser = await prisma.user.create({
        data: {
            email: email,
            password_hash: hashPassword,
            profile: {
                create: {
                    first_name: first_name || "",
                    last_name: last_name || "",
                },
            },
        },
        include: { profile: true },
    });

    // 4. ຕັດ password_hash ອອກ
    // const { password_hash: _, ...safeUser } = newUser;
    // return safeUser;
};

export const loginService = async (email: string, password: string) => {
    // 1. check emaill in DB
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) throw new Error("USER_NOT_FOUND");

    //2. check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error("INVALID_PASSWORD");

    // 3. // 3. create OJ payload ສ້າງມາເພື່ອເອົາໄປເົຂ້າ token
    const payload = {
        user: {
            id: user.user_id,
            email: user.email,
            role: user.role,
        },
    };
    // 4.ສ້າງ token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

    return { user: payload.user, token: `Bearer ${token}` };
};
