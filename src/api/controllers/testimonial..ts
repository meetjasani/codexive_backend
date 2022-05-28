import { celebrate } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import Joi from "joi";
import moment from "moment";
import { getRepository } from "typeorm";
import APIResponse from "../../utils/APIResponse";
import Testimonial from "../entity/testimonial";
var _ = require('lodash');

const addTestimonial = {
    validator: celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            image: Joi.string().required(),
            testimonial: Joi.string().required(),
            position: Joi.string().required()
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const testimonialRepo = getRepository(Testimonial);

            const newTestimonial = {
                name: req.body.name,
                image: req.body.image,
                testimonial: req.body.testimonial,
                position: req.body.position,
                is_deleted: false
            };

            const testimonial = testimonialRepo.create(newTestimonial);
            let result = await testimonialRepo.save(testimonial);
            result = JSON.parse(JSON.stringify(result));

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "Testimonial added Succesfully", 200));
            }

            throw new Error("Testimonial Not Added");
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

const editTestimonial = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
    validator: celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            image: Joi.string().required(),
            testimonial: Joi.string().required(),
            position: Joi.string().required()
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const testimonialRepo = getRepository(Testimonial);

            const checkTestimonial = await testimonialRepo.findOne({ where: { id: req.params.id, is_deleted: false } });

            if (!checkTestimonial) {
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .json(
                        new APIResponse(
                            null,
                            "Testimonial not found",
                            httpStatus.BAD_REQUEST,
                            httpStatus.BAD_REQUEST
                        )
                    );
            }

            const newTestimonial = {
                name: req.body.name,
                image: req.body.image,
                testimonial: req.body.testimonial,
                position: req.body.position,
                is_deleted: false
            };

            testimonialRepo.merge(checkTestimonial, newTestimonial);
            const result = await testimonialRepo.save(checkTestimonial);

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "Testimonial edit Succesfully", 200));
            }

            throw new Error("Testimonial Not Added");
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

const testimonialById = {
    validator: celebrate({
        params: Joi.object().keys({
            id: Joi.string().required(),
        }),
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const testimonialRepo = getRepository(Testimonial);

            const testimonial = await testimonialRepo
                .createQueryBuilder("testimonial")
                .select(["testimonial"])
                .where(`testimonial.id = '${req.params.id}'`)
                .andWhere("testimonial.is_deleted = :is_deleted", {
                    is_deleted: false,
                })
                .getOne();

            if (testimonial) {
                let newTestimonial;
                newTestimonial = {
                    id: testimonial.id,
                    name: testimonial.name,
                    testimonial: testimonial.testimonial,
                    position: testimonial.position,
                    image: testimonial.image.split(',').map(x => {
                        return {
                            displayImage: `${process.env.Image_Url}` + x,
                            image: x
                        }
                    })
                };
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(newTestimonial, "Testimonial get successfully.", httpStatus.OK)
                    );
            }

            throw new Error("Testimonial not found.");
        } catch (error) {
            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get Testimonial.",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};

const deleteTestimonial = {
    validator: celebrate({
        body: Joi.object().keys({
            id: Joi.string().required(),
        })
    }),

    controller: async (req: any, res: Response): Promise<Response> => {
        try {
            const testimonialRepo = getRepository(Testimonial);

            const results = await testimonialRepo
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
                    .json(new APIResponse(null, "Testimonial Deleted", httpStatus.OK));
            }
            throw new Error("Testimonial not Exists");
        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        null,
                        "Testimonial not Exists",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    },
};

const getTestimonialByUser = {
    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const testimonialRepo = getRepository(Testimonial);

            const testimonials = await testimonialRepo.find({ where: { is_deleted: false } });

            if (testimonials) {

                let ItemArray = [];

                for await (const testimonial of testimonials) {
                    ItemArray.push({
                        id: testimonial.id,
                        name: testimonial.name,
                        testimonial: testimonial.testimonial,
                        position: testimonial.position,
                        image: `${process.env.Image_Url}` + testimonial.image,
                        create_date: moment(testimonial.created_at).format("MMM DD,YYYY")
                    })
                }

                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(_.orderBy(ItemArray, 'create_date', 'desc'), "Testimonials get successfully.", httpStatus.OK)
                    );
            }

            throw new Error("Testimonials not found.");
        } catch (error) {
            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get Testimonials.",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};

const getFilteredTestimonial = {
    validator: celebrate({
        query: Joi.object().keys({
            search_term: Joi.string().allow(null, ""),
            per_page: Joi.number().required(),
            page_number: Joi.number().required()
        }),
    }),

    controller: async (req: any, res: Response): Promise<Response> => {

        try {
            const testimonialRepo = getRepository(Testimonial);

            let conditions = [];

            Object.keys(req.query).map((query) => {
                switch (query) {
                    case "search_term":
                        if (!req.query.search_term) break;
                        req.query.search_term.split(" ").map((x: string) => {
                            conditions.push(
                                `(testimonial.name ILIKE '%${x}%' OR testimonial.position ILIKE '%${x}%' OR testimonial.testimonial ILIKE '%${x}%')`
                            );
                        });
                        break;
                }
            });

            let query;

            query = testimonialRepo
                .createQueryBuilder("testimonial")
                .select(["testimonial"])


            conditions.map((x, i) => {
                if (!i) {
                    query = query.where(x);
                } else {
                    query = query.andWhere(x);
                }
            });

            const [testimonials, count] = await query
                .andWhere("testimonial.is_deleted = :deleted", {
                    deleted: false,
                })
                .orderBy("testimonial.created_at", "DESC")
                .skip(req.query.per_page * (req.query.page_number - 1))
                .take(req.query.per_page)
                .getManyAndCount();

            const AllCount = await testimonialRepo
                .createQueryBuilder("testimonial")
                .andWhere("testimonial.is_deleted = :deleted", {
                    deleted: false,
                })
                .getCount();
            let ItemArray = [];

            for await (const testimonial of testimonials) {
                ItemArray.push({
                    id: testimonial.id,
                    name: testimonial.name,
                    testimonial: testimonial.testimonial,
                    position: testimonial.position,
                    image: `${process.env.Image_Url}` + testimonial.image,
                })
            }


            const result = {
                testimonials: ItemArray,
                count: count,
                AllCount: AllCount,
            };
            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(result, "Testimonials get successfully.", httpStatus.OK)
                    );
            }
        } catch (err) {

            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(
                    new APIResponse(
                        err,
                        "Error in getting Testimonials",
                        httpStatus.INTERNAL_SERVER_ERROR
                    )
                );
        }
    },
};

export {
    addTestimonial,
    editTestimonial,
    testimonialById,
    deleteTestimonial,
    getTestimonialByUser,
    getFilteredTestimonial
}