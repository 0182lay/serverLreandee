import { prisma } from "../lib/prisma";

export const getCoursesService = async () => {
    const courses = await prisma.course.findMany({
        include: {
            category: true,
            instructor: {
                include: {
                    profile: true,
                },
            },
        },
    });
    return courses;
};

export const getCoursesByIdService = async (course_id: string) => {
    const course = await prisma.course.findUnique({
        where: { course_id },
        include: {
            category: true,
            instructor: {
                include: {
                    profile: true,
                },
            },
        },
    });

    if (!course) throw new Error("COURSE_NOT_FOUND");

    return course;
};

export const createCourseService = async (
    instructor_id: string,
    category_id: string,
    title: string,
    description: string | undefined,
    price: string,
) => {
    //ເຊັກວ່າ category ມີຢູ່ແທ້ບໍ່
    const category = await prisma.category.findUnique({
        where: { category_id },
    });

    if (!category) throw new Error("CATEGORY_NOT_FOUND");

    const course = await prisma.course.create({
        data: {
            instructor_id,
            category_id,
            title,
            description,
            price,
        },
    });
    return course;
};

export const updateCourseService = async (
    course_id: string,
    instructor_id: string,
    userRole: string,
    data: {
        category_id?: string;
        title?: string;
        description?: string;
        price?: number;
    },
) => {
    //ເຊັກວ່າ course ມີຢູ່ແທ້ບໍ່
    const course = await prisma.course.findUnique({
        where: { course_id },
    });

    if (!course) throw new Error("COURSE_NOT_FOUND");
    // ເັຊກ ownership ຄວາມເປັນເຈົ້າຂອງ - instructor ຕ້ອວເປັນເຈົ້າຂອງ
    if (userRole !== "admin" && course.instructor_id !== instructor_id) {
        throw new Error("FORBIDDEN");
    }

    const udpated = await prisma.course.update({
        where: { course_id },
        data,
    });
    return udpated;
};

export const deleteCourseService = async (
    course_id: string,
    instructor_id: string,
    userRole: string,
) => {
    const course = await prisma.course.findUnique({
        where: {
            course_id,
        },
    });

    if (!course) throw new Error("COURSE_NOT_FOUND");

    if (userRole !== "admin" && course.instructor_id !== instructor_id) {
        throw new Error("FORBIDDEN");
    }
    await prisma.course.delete({
        where: {
            course_id,
        },
    });
    return {
        message: "ລົບ Course ສຳເລັດ",
    };
};
