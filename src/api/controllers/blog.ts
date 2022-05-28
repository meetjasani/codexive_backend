import { celebrate } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import Joi from "joi";
import moment from "moment";
import { getRepository } from "typeorm";
import APIResponse from "../../utils/APIResponse";
import { Category } from "../entity";
import Blog from "../entity/blog";
var _ = require('lodash');
const addBlog = {
    validator: celebrate({
        body: Joi.object().keys({
            title: Joi.string().required(),
            details: Joi.string().required(),
            technologies: Joi.string().required(),
            image: Joi.string().required()
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const blogRepo = getRepository(Blog);

            const newBlog = {
                title: req.body.title,
                details: req.body.details,
                technologies: req.body.technologies,
                image: req.body.image,
                is_deleted: false
            };

            const blog = blogRepo.create(newBlog);
            let result = await blogRepo.save(blog);
            result = JSON.parse(JSON.stringify(result));

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "Blog added Succesfully", 200));
            }

            throw new Error("Blog Not Added");
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
    },
};

const editBlog = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
    validator: celebrate({
        body: Joi.object().keys({
            title: Joi.string().required(),
            details: Joi.string().required(),
            technologies: Joi.string().required(),
            image: Joi.string().required()
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const blogRepo = getRepository(Blog);

            const checkBlog = await blogRepo.findOne({ where: { id: req.params.id, is_deleted: false } });

            if (!checkBlog) {
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .json(
                        new APIResponse(
                            null,
                            "Blog not found",
                            httpStatus.BAD_REQUEST,
                            httpStatus.BAD_REQUEST
                        )
                    );
            }

            const newBlog = {
                title: req.body.title,
                details: req.body.details,
                technologies: req.body.technologies,
                image: req.body.image,
                is_deleted: false
            };

            blogRepo.merge(checkBlog, newBlog);
            const result = await blogRepo.save(checkBlog);

            // const portfolio = portfolioRepo.create(newPortfolio);
            // let result = await portfolioRepo.save(portfolio);
            // result = JSON.parse(JSON.stringify(result));

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "Blog edit Succesfully", 200));
            }

            throw new Error("Blog Not Added");
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
    },
};

const blogById = {
    validator: celebrate({
        params: Joi.object().keys({
            id: Joi.string().required(),
        }),
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const blogRepo = getRepository(Blog);

            const blog = await blogRepo
                .createQueryBuilder("blog")
                .select(["blog"])
                .where(`blog.id = '${req.params.id}'`)
                .andWhere("blog.is_deleted = :is_deleted", {
                    is_deleted: false,
                })
                .getOne();

            if (blog) {
                let newBlog;
                newBlog = {
                    id: blog.id,
                    title: blog.title,
                    details: blog.details,
                    technologies: blog.technologies,
                    image: blog.image.split(',').map(x => {
                        return {
                            displayImage: `${process.env.Image_Url}` + x,
                            image: x
                        }
                    })
                };
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(newBlog, "Blog get successfully.", httpStatus.OK)
                    );
            }

            throw new Error("Blog not found.");
        } catch (error) {
            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get Blog.",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};

const deleteBlog = {
    validator: celebrate({
        body: Joi.object().keys({
            id: Joi.string().required(),
        })
    }),

    controller: async (req: any, res: Response): Promise<Response> => {
        try {
            const blogRepo = getRepository(Blog);

            const results = await blogRepo
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
                    .json(new APIResponse(null, "Blog Deleted", httpStatus.OK));
            }
            throw new Error("Blog not Exists");
        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        null,
                        "Blog not Exists",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    },
};

const getBlogsByUser = {
    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const blogRepo = getRepository(Blog);

            const blogs = await blogRepo.find({ where: { is_deleted: false } });

            if (blogs) {

                let ItemArray = [];

                for await (const blog of blogs) {
                    ItemArray.push({
                        id: blog.id,
                        title: blog.title,
                        details: blog.details,
                        technologies: await GetCategoryValueByID(blog.technologies),
                        image: blog.image.split(",").length > 0 ? blog.image.split(',').map(x => `${process.env.Image_Url}` + x) : "",
                        create_date: moment(blog.created_at).format("MMM DD,YYYY")
                    })
                }

                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(_.orderBy(ItemArray, 'create_date', 'desc'), "Blogs get successfully.", httpStatus.OK)
                    );
            }

            throw new Error("Blogs not found.");
        } catch (error) {
            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get Blogs.",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};


const getFilteredBlogs = {
    validator: celebrate({
        query: Joi.object().keys({
            search_term: Joi.string().allow(null, ""),
            per_page: Joi.number().required(),
            page_number: Joi.number().required()
        }),
    }),


    controller: async (req: any, res: Response): Promise<Response> => {

        try {
            const blogRepo = getRepository(Blog);

            let conditions = [];

            Object.keys(req.query).map((query) => {
                switch (query) {
                    case "search_term":
                        if (!req.query.search_term) break;
                        req.query.search_term.split(" ").map((x: string) => {
                            conditions.push(
                                `(blog.title ILIKE '%${x}%' OR blog.technologies ILIKE '%${x}%')`
                            );
                        });
                        break;
                }
            });

            let query;

            query = blogRepo
                .createQueryBuilder("blog")
                .select(["blog"])


            conditions.map((x, i) => {
                if (!i) {
                    query = query.where(x);
                } else {
                    query = query.andWhere(x);
                }
            });

            const [blogs, count] = await query
                .andWhere("blog.is_deleted = :deleted", {
                    deleted: false,
                })
                .orderBy("blog.created_at", "DESC")
                .skip(req.query.per_page * (req.query.page_number - 1))
                .take(req.query.per_page)
                .getManyAndCount();

            const AllCount = await blogRepo
                .createQueryBuilder("blog")
                .andWhere("blog.is_deleted = :deleted", {
                    deleted: false,
                })
                .getCount();
            let ItemArray = [];

            for await (const blog of blogs) {
                ItemArray.push({
                    id: blog.id,
                    title: blog.title,
                    details: blog.details,
                    technologies: await GetCategoryValueByID(blog.technologies),
                    image: blog.image.split(",").length > 0 ? `${process.env.Image_Url}` + blog.image.split(",")[0] : "",
                })
            }


            const result = {
                blogs: ItemArray,
                count: count,
                AllCount: AllCount,
            };
            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(result, "Blogs get successfully.", httpStatus.OK)
                    );
            }
        } catch (err) {

            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(
                    new APIResponse(
                        err,
                        "Error in getting blogs",
                        httpStatus.INTERNAL_SERVER_ERROR
                    )
                );
        }
    },
};

function GetCategoryValueByID(CategoryID: string) {
    return new Promise(async (resolve, reject) => {

        try {
            let returnData = "";

            const categoryRepo = getRepository(Category)


            let query = categoryRepo
                .createQueryBuilder("category")
                .where("id IN(:...ids)", { ids: CategoryID.split(',').map((x) => x) })


            const categoryData = await query.getMany();

            if (categoryData.length > 0) {
                returnData = categoryData.map(x => x.category).join(',');
            } else {
                returnData = ""
            }

            resolve(returnData);
        } catch (e) {
            reject(e);
        }

    });
}


export {
    addBlog,
    editBlog,
    blogById,
    deleteBlog,
    getBlogsByUser,
    getFilteredBlogs
}