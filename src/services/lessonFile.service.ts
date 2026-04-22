import { FileType } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

export const getLessonFilesService = async (lesson_id: string) => {
    const lesson = await prisma.lesson.findUnique({
        where: { lesson_id },
    });

    if (!lesson) throw new Error("LESSON_NOT_FOUND");

    const files = await prisma.lessonFile.findMany({
        where: { lesson_id },
        orderBy: { order_index: "asc" },
    });
    return files;
};

export const createLessonFileService = async (
    lesson_id: string,
    instructor_id: string,
    data: {
        file_type: FileType;
        file_url: string;
        original_name: string;
        duration_seconds?: number;
        size_bytes?: number;
        order_index?: number;
    },
) => {
    // ເຊັກວ່າ lesson ມີຢູ່ແທ້ບໍ່
    const lesson = await prisma.lesson.findUnique({
        where: {
            lesson_id,
        },
        include: {
            course: true,
        },
    });

    if (!lesson) throw new Error("LESSON_NOT_FOUND");

    // ເຊັກ ownership
    if (lesson.course.instructor_id !== instructor_id) {
        throw new Error("FORBIDDEN");
    }
    const file = await prisma.lessonFile.create({
        data: {
            lesson_id,
            ...data,
        },
    });
    return file;
};

export const deleteLessonFileService = async (
    file_id: string,
    instructor_id: string,
    userRole: string,
) => {
    const file = await prisma.lessonFile.findUnique({
        where: { file_id },
        include: {
            lesson: {
                include: { course: true },
            },
        },
    });
    if (!file) throw new Error("FILE_NOT_FOUND");

    if (
        userRole !== "admin" &&
        file.lesson.course.instructor_id !== instructor_id
    ) {
        throw new Error("FORBIDDEN");
    }
    await prisma.lessonFile.delete({
        where: {
            file_id,
        },
    });
    return { message: "ລົບ file ສຳເລັດ" };
};
