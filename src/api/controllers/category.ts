import { celebrate } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import Joi from "joi";
import moment from "moment";
import { getRepository } from "typeorm";
import APIResponse from "../../utils/APIResponse";
import Category from "../entity/category";

const addCategory = {
    validator: celebrate({
        body: Joi.object().keys({
            category: Joi.string().required(),
            category_type: Joi.string().required(),
            parent_category_id: Joi.string().required()
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const categoryRepo = getRepository(Category)
            const newCategory = {
                category: req.body.category,
                parent_category_id: req.body.parent_category_id,
                category_type: req.body.category_type
            };
            const categoryInstance = categoryRepo.create(newCategory);
            let result = await categoryRepo.save(categoryInstance);
            result = JSON.parse(JSON.stringify(result));

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "Category added Succesfully", 200));
            }

            throw new Error("Category Not Added");
        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        {},
                        "Somthing went wrong",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    }
}

const editCategory = {
    validator: celebrate({
        body: Joi.object().keys({
            category: Joi.string().required(),
            category_type: Joi.string().required(),
            parent_category_id: Joi.string().required()
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const categoryRepo = getRepository(Category)

            const checkCategory = await categoryRepo.findOne({ where: { id: req.params.id, is_deleted: false } })

            if (!checkCategory) {
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .json(
                        new APIResponse(
                            null,
                            "Category not found",
                            httpStatus.BAD_REQUEST,
                            httpStatus.BAD_REQUEST
                        )
                    );
            }

            const newCategory = {
                category: req.body.category,
                parent_category_id: req.body.parent_category_id,
                category_type: req.body.category_type,
            };

            categoryRepo.merge(checkCategory, newCategory)

            let result = await categoryRepo.save(checkCategory)
            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "Category edit Succesfully", 200));
            }

            throw new Error("Category Not Added");
        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        {},
                        "Somthing went wrong",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    }
}

const deleteCategory = {
    validator: celebrate({
        body: Joi.object().keys({
            id: Joi.string().required(),
        })
    }),

    controller: async (req: any, res: Response): Promise<Response> => {
        try {
            const categoryRepo = getRepository(Category);

            const results = await categoryRepo
                .createQueryBuilder()
                .update({
                    is_deleted: true,
                    deleted_at: new Date().toUTCString()
                })
                .where("id IN(:...ids)", { ids: req.body.id.split(',').map((x) => x) })
                .execute();

            if (results) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse(null, "Category Deleted", httpStatus.OK));
            }
            throw new Error("Category not Exists");
        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        null,
                        "Category not Exists",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    },
}

const getAllCategoryByAdmin = {
    controller: async (req: any, res: Response): Promise<Response> => {
        try {
            const categoryRepo = getRepository(Category);

            let query;

            query = categoryRepo
                .createQueryBuilder("category")
                .select(["category"])

            const [category, count] = await query
                .where("category.is_deleted = :deleted", {
                    deleted: false,
                })
                .orderBy("category.created_at", "DESC")
                .skip(req.query.per_page * (req.query.page_number - 1))
                .take(req.query.per_page)
                .getManyAndCount();

            const AllCount = await categoryRepo
                .createQueryBuilder("category")
                .andWhere("category.is_deleted = :deleted", {
                    deleted: false,
                })
                .getCount();

            const result = {
                category: category.map((x) => {
                    return {
                        id: x.id,
                        category: x.category,
                        parent_category_id: x.parent_category_id,
                        category_type: x.category_type,
                        created_at: moment(x.created_at).format("YYYY.MM.DD"),
                    };
                }),
                count: count,
                AllCount: AllCount,
            };

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(result, "Category get successfully.", httpStatus.OK)
                    );
            }

            throw new Error("Category not found.");

        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        null,
                        "Category not Exists",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    }
}

const categoryDropDown = {
    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const categoryRepo = getRepository(Category);
            const category = await categoryRepo.find({ where: { is_deleted: false } })
            if (category) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(category, "Category get successfully.", httpStatus.OK)
                    );
            }

            throw new Error("Category not found.");

        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        null,
                        "Category not Exists",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    }
}

const categoryDropDownByParent = {
    validator: celebrate({
        params: Joi.object().keys({
            parentId: Joi.string().required(),
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const categoryRepo = getRepository(Category);
            const category = await categoryRepo.find({ where: { parent_category_id: req.params.parentId, is_deleted: false } })
            if (category) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(category, "Category get successfully.", httpStatus.OK)
                    );
            }

            throw new Error("Category not found.");

        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        null,
                        "Category not Exists",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    }
}

const categoryDropDownById = {
    validator: celebrate({
        params: Joi.object().keys({
            id: Joi.string().required(),
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const categoryRepo = getRepository(Category);
            const category = await categoryRepo.findOne({ where: { id: req.params.id, is_deleted: false } })
            if (category) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(category, "Category get successfully.", httpStatus.OK)
                    );
            }

            throw new Error("Category not found.");

        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        null,
                        "Category not Exists",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    }
}


export {
    addCategory,
    editCategory,
    deleteCategory,
    getAllCategoryByAdmin,
    categoryDropDown,
    categoryDropDownByParent,
    categoryDropDownById
}