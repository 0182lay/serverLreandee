import { prisma } from "../lib/prisma";

export const getProgressService = async (
    enrollment_id: string,
    student_id: string,
) => {
    // // ກວດເບິ່ງວ່າມີການລົງທະບຽນຕົວຈິງ ແລະເປັນຂອງນັກຮຽນຄົນນີ້ຫຼືບໍ່.
    const enrollment = await prisma.enrollment.findUnique({
        where: { enrollment_id },
    });

    if (!enrollment) throw new Error("ENROLLMENT_NOT_FOUND");

    if (enrollment.student_id !== student_id) {
        throw new Error("FORBIDDEN");
    }

    const progress = await prisma.learningProgress.findMany({
        where: { enrollment_id },
        include: {
            lesson: true,
        },
        orderBy: {
            lesson: { order_index: "asc" },
        },
    });

    return progress;
};

export const updateProgressService = async (
    enrollment_id: string,
    lesson_id: string,
    student_id: string,
    data: {
        watch_duration_seconds?: number;
        is_completed?: boolean;
    },
) => {
    // เช็คว่า enrollment มีอยู่จริงและเป็นของ student คนนี้ไหม
    const enrollment = await prisma.enrollment.findUnique({
        where: { enrollment_id },
    });

    if (!enrollment) throw new Error("ENROLLMENT_NOT_FOUND");

    if (enrollment.student_id !== student_id) {
        throw new Error("FORBIDDEN");
    }

    // ກວດເບິ່ງວ່າ lesson ຢູ່ໃນ course ນັ້ນມີແທ້ຫຼືບໍ່
    const lesson = await prisma.lesson.findFirst({
        where: {
            lesson_id,
            course_id: enrollment.course_id,
        },
    });

    if (!lesson) throw new Error("LESSON_NOT_FOUND");

    // upsert — ຖ້າມັນມີຢູ່ແລ້ວ, ອັບເດດ. ຖ້າບໍ່ມີ, ສ້າງອັນໃໝ່.
    const progress = await prisma.learningProgress.upsert({
        where: {
            enrollment_id_lesson_id: { enrollment_id, lesson_id },
        },
        update: {
            ...data,
            last_accessed_at: new Date(),
            completed_at: data.is_completed ? new Date() : undefined,
        },
        create: {
            enrollment_id,
            lesson_id,
            ...data,
            last_accessed_at: new Date(),
            completed_at: data.is_completed ? new Date() : undefined,
        },
    });

    return progress;
};
