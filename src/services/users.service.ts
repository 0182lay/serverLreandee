import { prisma } from "../lib/prisma";

export const getUsersService = async () => {
    const users = await prisma.user.findMany({
        select: {
            user_id: true,
            email: true,
            role: true,
            is_active: true,
            created_at: true,
            updated_at: true,
            profile: true,
        },
    });
    return users;
};

export const getByIdService = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            user_id: userId,
        },
        include: {
            profile: true,
        },
    });

    if (!user) throw new Error("USER_NOT_FOUND");

    const { password_hash: _, ...safeUser } = user;

    return safeUser;
};

export const updateUserService = async (
    userId: string,
    data: {
        email?: string;
        first_name?: string;
        last_name?: string;
        avatar_url?: string;
        bio?: string;
        phone?: string;
    },
) => {
    // 1. ເຊັກອີເມວ in DB
    const user = await prisma.user.findUnique({
        where: {
            user_id: userId,
        },
    });
    if (!user) throw new Error("USER_NOT_FOUND");

    // 2. update
    const updated = await prisma.user.update({
        where: { user_id: userId },
        data: {
            email: data.email,
            profile: {
                update: {
                    first_name: data.first_name,
                    last_name: data.last_name,
                    avatar_url: data.avatar_url,
                    bio: data.bio,
                    phone: data.phone,
                },
            },
        },
        select: {
            user_id: true,
            email: true,
            role: true,
            profile: true,
        },
    });
    return updated;
};

export const deleteUserService = async (userId: string) => {
    //ເຊັກກ່ອນວ່າ user id ນີ້ມີບໍ່
    const user = await prisma.user.findUnique({
        where: {
            user_id: userId,
        },
    });
    if (!user) throw new Error("USER_NOT_FOUND");

    //delete
    await prisma.user.delete({
        where: {
            user_id: userId,
        },
    });
    return user;
};
