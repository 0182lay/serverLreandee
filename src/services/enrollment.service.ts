import { prisma } from "../lib/prisma";

export const getEnrollmentsService = async (student_id: string) => {
    const enrollments = await prisma.enrollment.findMany({
        where: {
            student_id,
        },
        include: {
            course: {
                include: {
                    category: true,
                    instructor: {
                        include: { profile: true },
                    },
                },
            },
        },
        orderBy: { enrolled_at: "desc" },
    });
};

export const enrollCourseService = async (
    student_id: string,
    course_id: string,
) => {
    // ເຊັກວ່າ course ມີຢູ່ຈິງແລະ publish ແລ້ວບໍ
    const course = await prisma.course.findUnique({
        where: { course_id },
    });

    if (!course) throw new Error("COURSE_NOT_FOUND");
    if (!course.is_published) throw new Error("COURSE_NOT_PUBLISHED");

    // ກວດເບິ່ງວ່າທ່ານໄດ້ລົງທະບຽນແລ້ວຫຼືຍັງ.
    const existing = await prisma.enrollment.findUnique({
        where: {
            student_id_course_id: { student_id, course_id },
        },
    });

    if (existing) throw new Error("ALREADY_ENROLLED");

    const enrollment = await prisma.enrollment.create({
        data: {
            student_id,
            course_id,
            amount_paid: course.price,
        },
    });

    return enrollment;
};

export const cancelEnrollmentService = async (
    enrollment_id: string,
    student_id: string,
    userRole: string,
) => {
    // ກວດເບິ່ງວ່າ enrollment ມີແທ້ຫຼືບໍ່.
    const enrollment = await prisma.enrollment.findUnique({
        where: { enrollment_id },
    });

    if (!enrollment) throw new Error("ENROLLMENT_NOT_FOUND");

    //  ownership — student ກວດສອບຄວາມເປັນເຈົ້າຂອງ - ນັກຮຽນຕ້ອງເປັນເຈົ້າຂອງ.
    if (userRole !== "admin" && enrollment.student_id !== student_id) {
        throw new Error("FORBIDDEN");
    }

    await prisma.enrollment.delete({
        where: { enrollment_id },
    });

    return { message: "ຍົກເລີກການລົງທະບຽນສຳເລັດ" };
};
