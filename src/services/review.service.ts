import { prisma } from "../lib/prisma";

export const getReviewsService = async (course_id: string) => {
    const course = await prisma.course.findUnique({
        where: { course_id },
    });

    if (!course) throw new Error("COURSE_NOT_FOUND");

    const reviews = await prisma.courseReview.findMany({
        where: { course_id },
        include: {
            student: {
                include: { profile: true },
            },
        },
        orderBy: { created_at: "desc" },
    });

    return reviews;
};

export const createReviewService = async (
    course_id: string,
    student_id: string,
    data: {
        rating: number;
        comment?: string;
    },
) => {
    // ເຊັກວ່າ course ມີຢູ່ແທ້ບໍ່
    const course = await prisma.course.findUnique({
        where: { course_id },
    });

    if (!course) throw new Error("COURSE_NOT_FOUND");

    // ເຊັກວ່າ student ລົງທະບຽນ course ນີ້ແລ້ວບໍ່
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            student_id_course_id: { student_id, course_id },
        },
    });

    if (!enrollment) throw new Error("NOT_ENROLLED");

    // ເຊັກວ່າ review ໄປແລ້ວ ຫຼື ບໍ
    const existing = await prisma.courseReview.findUnique({
        where: {
            course_id_student_id: { course_id, student_id },
        },
    });

    if (existing) throw new Error("ALREADY_REVIEWED");

    // ເຊັກ rating ຕ້ອງຢູ່ລະຫວ່າງ 1-5
    if (data.rating < 1 || data.rating > 5) {
        throw new Error("INVALID_RATING");
    }

    const review = await prisma.courseReview.create({
        data: {
            course_id,
            student_id,
            ...data,
        },
    });

    return review;
};

export const updateReviewService = async (
    review_id: string,
    student_id: string,
    userRole: string,
    data: {
        rating?: number;
        comment?: string;
    },
) => {
    const review = await prisma.courseReview.findUnique({
        where: { review_id },
    });

    if (!review) throw new Error("REVIEW_NOT_FOUND");

    // ເຊັກ ownership
    if (userRole !== "admin" && review.student_id !== student_id) {
        throw new Error("FORBIDDEN");
    }

    // ເຊັກ rating ຕ້ອງຢູ່ລະຫວ່າງ 1-5
    if (data.rating && (data.rating < 1 || data.rating > 5)) {
        throw new Error("INVALID_RATING");
    }

    const updated = await prisma.courseReview.update({
        where: { review_id },
        data,
    });

    return updated;
};

export const deleteReviewService = async (
    review_id: string,
    student_id: string,
    userRole: string,
) => {
    const review = await prisma.courseReview.findUnique({
        where: { review_id },
    });

    if (!review) throw new Error("REVIEW_NOT_FOUND");

    // ເຊັກວ່າ ownership
    if (userRole !== "admin" && review.student_id !== student_id) {
        throw new Error("FORBIDDEN");
    }

    await prisma.courseReview.delete({
        where: { review_id },
    });

    return { message: "ລົບ Review ສຳເລັດ" };
};
