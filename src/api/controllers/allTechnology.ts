import { celebrate } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import Joi from "joi";
import moment from "moment";
import { getRepository } from "typeorm";
import APIResponse from "../../utils/APIResponse";
import { TechType } from "../../utils/constant";
import AllTechnology from "../entity/allTechnology";

const addTechnology = {
    validator: celebrate({
        body: Joi.object().keys({
            type: Joi.string().required(),
            name: Joi.string().required(),
            image: Joi.string().required(),
            firstColor: Joi.string().required(),
            secondColor: Joi.string().required(),
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const techRepo = getRepository(AllTechnology)
            const newTech = {
                type: req.body.type,
                name: req.body.name,
                image: req.body.image,
                firstColor: req.body.firstColor,
                secondColor: req.body.secondColor,
            };
            const techInstance = techRepo.create(newTech);
            let result = await techRepo.save(techInstance);
            result = JSON.parse(JSON.stringify(result));

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "Technology added Succesfully", 200));
            }

            throw new Error("Technology Not Added");
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


const editTechnology = {
    validator: celebrate({
        body: Joi.object().keys({
            type: Joi.string().required(),
            name: Joi.string().required(),
            image: Joi.string().required(),
            firstColor: Joi.string().required(),
            secondColor: Joi.string().required(),
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const techRepo = getRepository(AllTechnology)

            const checktech = await techRepo.findOne({ where: { id: req.params.id, is_deleted: false } })

            if (!checktech) {
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .json(
                        new APIResponse(
                            null,
                            "Technology not found",
                            httpStatus.BAD_REQUEST,
                            httpStatus.BAD_REQUEST
                        )
                    );
            }

            const newTechnology = {
                type: req.body.type,
                name: req.body.name,
                image: req.body.image,
                firstColor: req.body.firstColor,
                secondColor: req.body.secondColor,
            };

            techRepo.merge(checktech, newTechnology)

            let result = await techRepo.save(checktech)
            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "Technology edit Succesfully", 200));
            }

            throw new Error("Technology Not Added");
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


const deleteTechnology = {
    validator: celebrate({
        body: Joi.object().keys({
            id: Joi.string().required(),
        })
    }),

    controller: async (req: any, res: Response): Promise<Response> => {
        try {
            const techRepo = getRepository(AllTechnology)

            const results = await techRepo
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
                    .json(new APIResponse(null, "Technology Deleted", httpStatus.OK));
            }
            throw new Error("Technology not Exists");
        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        null,
                        "Technology not Exists",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    },
}


const getAllTechnology = {
    validator: celebrate({
        query: Joi.object().keys({
            per_page: Joi.number().required(),
            page_number: Joi.number().required(),
        }),
    }),

    controller: async (req: any, res: Response): Promise<Response> => {
        try {
            const techRepo = getRepository(AllTechnology)

            let query;

            query = techRepo
                .createQueryBuilder("alltechnology")
                .select(["alltechnology"])

            const [alltechnology, count] = await query
                .where("alltechnology.is_deleted = :deleted", {
                    deleted: false,
                })
                .orderBy("alltechnology.created_at", "DESC")
                .skip(req.query.per_page * (req.query.page_number - 1))
                .take(req.query.per_page)
                .getManyAndCount();

            const AllCount = await techRepo
                .createQueryBuilder("alltechnology")
                .andWhere("alltechnology.is_deleted = :deleted", {
                    deleted: false,
                })
                .getCount();

            const result = {
                alltechnology: alltechnology.map((x) => {

                    return {
                        id: x.id,
                        type: x.type,
                        name: x.name,
                        image: x.image != "" ? `${process.env.Image_Url}` + x.image : "",
                        firstColor: x.firstColor,
                        secondColor: x.secondColor,
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
                        new APIResponse(result, "Technology get successfully.", httpStatus.OK)
                    );
            }

            throw new Error("Technology not found.");

        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        null,
                        "Technology not Exists",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    }
}

const getTechnologyById = {
    validator: celebrate({
        params: Joi.object().keys({
            id: Joi.string().required(),
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const techRepo = getRepository(AllTechnology)
            const technology = await techRepo.findOne({ where: { id: req.params.id, is_deleted: false } })
            let result = {}
            if (techRepo == null || techRepo == undefined) {
                result = {}
            } else {
                result = {
                    id: technology.id,
                    type: technology.type,
                    name: technology.name,
                    image: {
                        displayImage: technology.image != "" ? `${process.env.Image_Url}` + technology.image : "",
                        image: technology.image != "" ? technology.image : "",
                    },
                    firstColor: technology.firstColor,
                    secondColor: technology.secondColor,
                    created_at: moment(technology.created_at).format("YYYY.MM.DD"),
                }
            }
            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(result, "Technology get successfully.", httpStatus.OK)
                    );
            }

            throw new Error("Technology not found.");

        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        null,
                        "Technology not Exists",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    }
}

const getTechnologyByType = {
    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const techRepo = getRepository(AllTechnology)
            let result = {
                Category: [],
                Services: []
            }
            const category = await techRepo.find({ where: { type: TechType.category, is_deleted: false } })
            const services = await techRepo.find({ where: { type: TechType.service, is_deleted: false } })

            result = {
                Category: category.map((category) => {
                    return {
                        value: category.id,
                        image: category.image != "" ? `${process.env.Image_Url}` + category.image : "",
                        label: category.name,
                        firstColor: category.firstColor,
                        secondColor: category.secondColor,
                    }
                }),
                Services: services.map((service) => {
                    return {
                        value: service.id,
                        image: service.image != "" ? `${process.env.Image_Url}` + service.image : "",
                        label: service.name,
                        firstColor: service.firstColor,
                        secondColor: service.secondColor,
                    }
                }),
            }
            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(result, "Technology get successfully.", httpStatus.OK)
                    );
            }

            throw new Error("Technology not found.");

        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        null,
                        "Technology not Exists",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    }
}

export {
    addTechnology,
    editTechnology,
    deleteTechnology,
    getAllTechnology,
    getTechnologyById,
    getTechnologyByType
}