import { Request, Response } from "express";
import {
    getCategoriesService,
    getCategoryByIdService,
    createCategoryService,
    updateCategoryService,
    deleteCategoryService,
} from "../services/categories.service";

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await getCategoriesService();
        return res.status(200).json({
            message: "ດຶງຂໍ້ມູນສຳເັລດ",
            data: categories,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "server error",
        });
    }
};

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.categoryId as string;

        const category = await getCategoryByIdService(categoryId);
        return res.status(200).json({
            data: category,
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            message: "server error",
        });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;

        // 1. ເພີ່ມ Validate ປ້ອງກັນຄົນສົ່ງຄ່າວ່າງມາ
        if (!name) {
            return res.status(400).json({
                message: "ກະລຸນາລະບຸຊື່ໝວດໝູ່",
            });
        }
        const category = await createCategoryService(name, description);

        return res.status(201).json({
            message: "ສ້າງໝວດໝູ່ສຳເລັດ",
            data: category,
        });
    } catch (error: any) {
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "ຊື່ໝວດໝູ່ມີໃນລະບົບແລ້ວ",
            });
        }
        if (error.message === "NO_CATEGORY_FOUND") {
            return res.status(404).json({
                message: "ບໍ່ພົບໝວດໝູ່",
            });
        }
        console.log(error);
        return res.status(500).json({
            message: "server error",
        });
    }
};
export const updateCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.categoryId as string;
        const { name, description } = req.body;

        const updated = await updateCategoryService(categoryId, {
            name,
            description,
        });
        return res.status(200).json({
            message: "ອັບເດດສຳເລັດ!!!",
            data: updated,
        });
    } catch (error: any) {
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "ຊື່ໝວດໝູ່ມີໃນລະບົບແລ້ວ",
            });
        }
        if (error.message === "NO_CATEGORY_FOUND") {
            return res.status(404).json({
                message: "ບໍ່ພົບຂໍ້ມູນປະເພດທີ່ຈະອັບເດດ",
            });
        }
        console.log(error);
        return res.status(500).json({
            message: "server error",
        });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.categoryId as string;

        await deleteCategoryService(categoryId);
        return res.status(200).json({
            message: "ລົບໝວດໝູ່ສຳເລັດແລ້ວ",
        });
    } catch (error: any) {
        if (error.message === "NO_CATEGORY_FOUND") {
            return res.status(404).json({
                message: "ບໍ່ພົບຊື່ໝວດໝູ່",
            });
        }
        console.log(error);
        return res.status(500).json({
            message: "server error",
        });
    }
};
