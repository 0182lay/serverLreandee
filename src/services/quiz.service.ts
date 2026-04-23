import { prisma } from "../lib/prisma";
import { QuestionType } from "../../generated/prisma/client";

export const getQuizService = async (lesson_id: string) => {
    const quiz = await prisma.quiz.findUnique({
        where: { lesson_id },
        include: {
            questions: {
                orderBy: { order_index: "asc" },
            },
        },
    });

    if (!quiz) throw new Error("QUIZ_NOT_FOUND");

    return quiz;
};

export const createQuizService = async (
    lesson_id: string,
    instructor_id: string,
    data: {
        title: string;
        description?: string;
        questions: {
            question_text: string;
            question_type: QuestionType;
            options: string[];
            correct_answer: string;
            order_index?: number;
        }[];
    },
) => {
    // ເຊັກວ່າ lesson ມີຢູ່ແທ້ບໍ່
    const lesson = await prisma.lesson.findUnique({
        where: { lesson_id },
        include: { course: true },
    });

    if (!lesson) throw new Error("LESSON_NOT_FOUND");

    // ເຊັກ ownership
    if (lesson.course.instructor_id !== instructor_id) {
        throw new Error("FORBIDDEN");
    }

    // ເຊັກວ່າມີ quiz ຢູ່ແລ້ວບໍ
    const existing = await prisma.quiz.findUnique({
        where: { lesson_id },
    });

    if (existing) throw new Error("QUIZ_ALREADY_EXISTS");

    const quiz = await prisma.quiz.create({
        data: {
            lesson_id,
            title: data.title,
            description: data.description,
            questions: {
                create: data.questions,
            },
        },
        include: {
            questions: true,
        },
    });

    return quiz;
};

export const updateQuizService = async (
    lesson_id: string,
    instructor_id: string,
    userRole: string,
    data: {
        title?: string;
        description?: string;
    },
) => {
    const quiz = await prisma.quiz.findUnique({
        where: { lesson_id },
        include: { lesson: { include: { course: true } } },
    });

    if (!quiz) throw new Error("QUIZ_NOT_FOUND");

    // ເຊັກ ownership
    if (
        userRole !== "admin" &&
        quiz.lesson.course.instructor_id !== instructor_id
    ) {
        throw new Error("FORBIDDEN");
    }

    const updated = await prisma.quiz.update({
        where: { lesson_id },
        data,
    });

    return updated;
};

export const deleteQuizService = async (
    lesson_id: string,
    instructor_id: string,
    userRole: string,
) => {
    const quiz = await prisma.quiz.findUnique({
        where: { lesson_id },
        include: { lesson: { include: { course: true } } },
    });

    if (!quiz) throw new Error("QUIZ_NOT_FOUND");

    // ເຊັກ ownership
    if (
        userRole !== "admin" &&
        quiz.lesson.course.instructor_id !== instructor_id
    ) {
        throw new Error("FORBIDDEN");
    }

    await prisma.quiz.delete({
        where: { lesson_id },
    });

    return { message: "ລົບ Quiz ສຳເລັດ" };
};

export const submitQuizService = async (
    lesson_id: string,
    student_id: string,
    answers: {
        question_id: string;
        answer: string;
    }[],
) => {
    const quiz = await prisma.quiz.findUnique({
        where: { lesson_id },
        include: { questions: true },
    });

    if (!quiz) throw new Error("QUIZ_NOT_FOUND");

    // ຄຳນວນຄະແນນ
    let score = 0;
    for (const ans of answers) {
        const question = quiz.questions.find(
            (q) => q.question_id === ans.question_id,
        );
        if (question && question.correct_answer === ans.answer) {
            score++;
        }
    }

    const total = quiz.questions.length;

    // ລົບ submission ເກົ່າຖ້າມີ
    await prisma.quizSubmission.deleteMany({
        where: {
            quiz_id: quiz.quiz_id,
            student_id,
        },
    });

    // ບັນທຶກ submission ໃຫມ່
    const submission = await prisma.quizSubmission.create({
        data: {
            quiz_id: quiz.quiz_id,
            student_id,
            score,
            total,
        },
    });

    return { submission, score, total };
};
export const getQuizResultService = async (
    lesson_id: string,
    student_id: string,
) => {
    const quiz = await prisma.quiz.findUnique({
        where: { lesson_id },
    });

    if (!quiz) throw new Error("QUIZ_NOT_FOUND");

    const submissions = await prisma.quizSubmission.findMany({
        where: {
            quiz_id: quiz.quiz_id,
            student_id,
        },
        orderBy: { submitted_at: "desc" },
    });

    if (submissions.length === 0) throw new Error("SUBMISSION_NOT_FOUND");

    return submissions;
};
