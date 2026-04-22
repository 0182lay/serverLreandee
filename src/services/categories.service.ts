import { prisma } from "../lib/prisma";

export const getCategoriesService = async () => {
    const categories = await prisma.category.findMany({
        select: {
            category_id: true,
            name: true,
            description: true,
            created_at: true,
            updated_at: true,
        },
    });
    return categories;
};

export const getCategoryByIdService = async (categoryId: string) => {
    const category = await prisma.category.findUnique({
        where: {
            category_id: categoryId,
        },
    });

    if (!category) throw new Error("NO_CATEGORY_FOUND");

    return category;
};

export const createCategoryService = async (
    name: string,
    description?: string,
) => {
    const newCategory = await prisma.category.create({
        data: {
            name: name,
            description: description,
        },
    });
    return newCategory;
};

export const updateCategoryService = async (
    categoryId: string,
    data: {
        name?: string;
        description?: string;
    },
) => {
    const category = await prisma.category.findUnique({
        where: {
            category_id: categoryId,
        },
    });
    if (!category) throw new Error("NO_CATEGORY_FOUND");

    const updated = await prisma.category.update({
        where: { category_id: categoryId },
        data: {
            name: data.name,
            description: data.description,
        },
    });
    return updated;
};

export const deleteCategoryService = async (categoryId: string) => {
    //ເຊັກກ່ອນວ່າ  category id ມີບໍ່ in DB
    const category = await prisma.category.findUnique({
        where: {
            category_id: categoryId,
        },
    });
    if (!category) throw new Error("NO_CATEGORY_FOUND");

    await prisma.category.delete({
        where: {
            category_id: categoryId,
        },
    });
    return category;
};
