import { prisma } from "../lib/prisma";

export const getLessonsService = async (course_id: string) => {
    //ເຊັກວ່າ course ມີຢູ່ແທ້ບໍ່
    const course = await prisma.course.findUnique({
        where: {
            course_id,
        },
    });

    if (!course) throw new Error("COURSE_NOT_FOUND");

    const lessons = await prisma.lesson.findMany({
        where: { course_id },
        include: {
            files: true,
        },
        orderBy: {
            order_index: "asc",
        },
    });
    return lessons;
};

export const getLessonByIdService = async (
    course_id: string,
    lesson_id: string,
) => {
    const lesson = await prisma.lesson.findFirst({
        where: {
            lesson_id,
            course_id, // ← ເຊັກເບິ່ງວ່າ lesson ນີ້ຢູ່ໃນ course ມີແທ້ບໍ່
        },
        include: {
            files: true,
        },
    });
    if (!lesson) throw new Error("LESSON_NOT_FOUND");

    return lesson;
};

export const createLessonService = async (
    course_id: string,
    instructor_id: string,
    data: {
        title: string;
        description?: string;
        order_index?: number;
        is_free_preview?: boolean;
    },
) => {
    //ເຊັກຄອສວ່າມີບໍ່
    const course = await prisma.course.findUnique({
        where: {
            course_id,
        },
    });
    if (!course) throw new Error("COURSE_NOT_FOUND");

    //ເຊັກວ່າເປັນເຈົ້າຂອງ course ບໍ່
    if (course.instructor_id !== instructor_id) {
        throw new Error("FORBIDDEN");
    }

    const lesson = await prisma.lesson.create({
        data: {
            course_id,
            ...data,
        },
    });
    return lesson;
};

export const updateLessonService = async (
    course_id: string,
    lesson_id: string,
    instructor_id: string,
    userRole: string,
    data: {
        title?: string;
        description?: string;
        order_index?: number;
        is_free_preview?: boolean;
    },
) => {
    //ເຊັກວ່າ lesson ມີຢູ່ແທ້ ແລະ ຢູ່ໃນ course ນີ້ບໍ
    const lesson = await prisma.lesson.findFirst({
        where: {
            lesson_id,
            course_id,
        },
        include: { course: true },
    });
    if (!lesson) throw new Error("LESSON_NOT_FOUND");

    //ເຊັກ ownership
    if (userRole !== "admin" && lesson.course.instructor_id !== instructor_id) {
        throw new Error("FORBIDDEN");
    }

    const updated = await prisma.lesson.update({
        where: { lesson_id },
        data,
    });
    return updated;
};

export const deleteLessonService = async (
    course_id: string,
    lesson_id: string,
    instructor_id: string,
    userRole: string,
) => {
    //ເຊັກກ່ອນວ່າ lesson ມີຢູ່ຈິງ ແລະ ຢູ່ໃນ course ນີ້ບໍ
    const lesson = await prisma.lesson.findFirst({
        where: { lesson_id, course_id },
        include: { course: true },
    });

    if (!lesson) throw new Error("LESSON_NOT_FOUND");

    //ເຊັກ ownership
    if (userRole !== "admin" && lesson.course.instructor_id !== instructor_id) {
        throw new Error("FORBIDDEN");
    }

    await prisma.lesson.delete({
        where: { lesson_id },
    });
    return { message: "ລົບ Lesson ສຳເລັດ" };
};
