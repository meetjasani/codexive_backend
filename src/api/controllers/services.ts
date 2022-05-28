import { celebrate } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import Joi from "joi";
import moment from "moment";
import { getRepository } from "typeorm";
import APIResponse from "../../utils/APIResponse";
import { Category } from "../entity";
import Service from "../entity/services";

const addService = {
    validator: celebrate({
        body: Joi.object().keys({
            main_service: Joi.string().required(),
            sub_services: Joi.string().required(),
            sub_services_id: Joi.string().required(),
            title: Joi.string().required(),
            description: Joi.string().required(),
            image: Joi.string().required(),
            title_second: Joi.string().required(),
            description_second: Joi.string().required(),
            image_second: Joi.string().required()
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const serviceRepo = getRepository(Service)
            const subService = await serviceRepo.findOne({
                where: { sub_services_id: req.body.sub_services_id, is_deleted: false },
            });
            if (subService) {
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .json(new APIResponse({}, "Sub Service already exists", 400));
            } else {
                const newService = {
                    main_service: req.body.main_service,
                    sub_services_id: req.body.sub_services_id,
                    sub_services: req.body.sub_services,
                    title: req.body.title,
                    description: req.body.description,
                    image: req.body.image,
                    title_second: req.body.title_second,
                    description_second: req.body.description_second,
                    image_second: req.body.image_second
                };
                const serviceInstance = serviceRepo.create(newService);
                let result = await serviceRepo.save(serviceInstance);
                result = JSON.parse(JSON.stringify(result));

                if (result) {
                    return res
                        .status(httpStatus.OK)
                        .json(new APIResponse({}, "Service added Succesfully", 200));
                }
            }
            throw new Error("Service Not Added");
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

const editServices = {
    validator: celebrate({
        body: Joi.object().keys({
            main_service: Joi.string().required(),
            sub_services: Joi.string().required(),
            sub_services_id: Joi.string().required(),
            title: Joi.string().required(),
            description: Joi.string().required(),
            image: Joi.string().required(),
            title_second: Joi.string().required(),
            description_second: Joi.string().required(),
            image_second: Joi.string().required()
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const serviceRepo = getRepository(Service)

            const checkService = await serviceRepo.findOne({ where: { id: req.params.id, is_deleted: false } })

            if (!checkService) {
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .json(
                        new APIResponse(
                            null,
                            "Service not found",
                            httpStatus.BAD_REQUEST,
                            httpStatus.BAD_REQUEST
                        )
                    );
            }

            const newService = {
                main_service: req.body.main_service,
                sub_services: req.body.sub_services,
                sub_services_id: req.body.sub_services_id,
                title: req.body.title,
                description: req.body.description,
                image: req.body.image,
                title_second: req.body.title_second,
                description_second: req.body.description_second,
                image_second: req.body.image_second
            };

            serviceRepo.merge(checkService, newService)

            let result = await serviceRepo.save(checkService)
            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "Service edit Succesfully", 200));
            }

            throw new Error("Service Not Added");
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

const getAllServices = {
    controller: async (req: any, res: Response): Promise<Response> => {
        try {
            const serviceRepo = getRepository(Service);

            let query;

            query = serviceRepo
                .createQueryBuilder("services")
                .select(["services"])

            const [services, count] = await query
                .where("services.is_deleted = :deleted", {
                    deleted: false,
                })
                .orderBy("services.created_at", "DESC")
                .skip(req.query.per_page * (req.query.page_number - 1))
                .take(req.query.per_page)
                .getManyAndCount();

            const AllCount = await serviceRepo
                .createQueryBuilder("services")
                .andWhere("services.is_deleted = :deleted", {
                    deleted: false,
                })
                .getCount();

            let ItemArray = [];

            for await (const x of services) {
                ItemArray.push({
                    id: x.id,
                    main_service: x.main_service,
                    sub_services: await GetCategoryValueByID(x.sub_services),
                    title: x.title,
                    description: x.description,
                    image: x.image != "" ? `${process.env.Image_Url}` + x.image : "",
                    title_second: x.title_second,
                    description_second: x.description_second,
                    image_second: x.image_second != "" ? `${process.env.Image_Url}` + x.image_second : "",
                    created_at: moment(x.created_at).format("YYYY.MM.DD"),
                })
            }
            const result = {
                services: ItemArray,
                count: count,
                AllCount: AllCount,
            };

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(result, "Services get successfully.", httpStatus.OK)
                    );
            }

            throw new Error("Services not found.");

        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        null,
                        "Services not Exists",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    }
}

const getServicesById = {
    validator: celebrate({
        params: Joi.object().keys({
            id: Joi.string().required(),
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const serviceRepo = getRepository(Service);
            const services = await serviceRepo.findOne({ where: { id: req.params.id, is_deleted: false } })
            let result = {}
            if (services == null || services == undefined) {
                result = {}
            } else {
                result = await {
                    id: services.id,
                    main_service: services.main_service,
                    sub_services: services.sub_services,
                    sub_services_id: services.sub_services_id,
                    title: services.title,
                    description: services.description,
                    image: {
                        displayImage: services.image != "" ? `${process.env.Image_Url}` + services.image : "",
                        image: services.image
                    },
                    title_second: services.title_second,
                    description_second: services.description_second,
                    image_second: {
                        displayImage: services.image_second != "" ? `${process.env.Image_Url}` + services.image_second : "",
                        image: services.image_second
                    }
                }
            }
            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(result, "Services get successfully.", httpStatus.OK)
                    );
            }

            throw new Error("Services not found.");

        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        null,
                        "Services not Exists",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    }
}


const getServicesBySubId = {
    validator: celebrate({
        params: Joi.object().keys({
            id: Joi.string().required(),
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const serviceRepo = getRepository(Service);
            const services = await serviceRepo.findOne({ where: { sub_services_id: req.params.id, is_deleted: false } })
            let result = {}
            if (services == null || services == undefined) {
                result = {}
            } else {
                result = await {
                    id: services.id,
                    main_service: services.main_service,
                    sub_services: await GetCategoryValueByID(services.sub_services_id),
                    sub_services_id: services.sub_services_id,
                    title: services.title,
                    description: services.description,
                    image: {
                        displayImage: services.image != "" ? `${process.env.Image_Url}` + services.image : "",
                        image: services.image
                    },
                    title_second: services.title_second,
                    description_second: services.description_second,
                    image_second: {
                        displayImage: services.image_second != "" ? `${process.env.Image_Url}` + services.image_second : "",
                        image: services.image_second
                    }
                }
            }
            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(result, "Services get successfully.", httpStatus.OK)
                    );
            }

            throw new Error("Services not found.");

        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        null,
                        "Services not Exists",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    }
}

const deleteServicesById = {
    validator: celebrate({
        body: Joi.object().keys({
            id: Joi.string().required(),
        })
    }),

    controller: async (req: any, res: Response): Promise<Response> => {
        try {
            const serviceRepo = getRepository(Service);
            const results = await serviceRepo
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
                    .json(new APIResponse(null, "Services Deleted", httpStatus.OK));
            }
            throw new Error("Services not Exists");
        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        null,
                        "Services not Exists",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    },
}


function GetCategoryValueByID(CategoryID: string) {
    return new Promise(async (resolve, reject) => {

        try {
            let returnData = "";

            const categoryRepo = getRepository(Category)


            let query = categoryRepo
                .createQueryBuilder("category")
                .where("id = :id", { id: CategoryID })


            const categoryData = await query.getOne();

            if (categoryData) {
                returnData = categoryData.category;
            } else {
                returnData = ""
            }

            resolve(returnData);
        } catch (e) {
            reject(e);
        }

    });
}


const getAllServicesByName = {
    validator: celebrate({
        params: Joi.object().keys({
            name: Joi.string().required(),
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const categoryRepo = getRepository(Category);
            const serviceRepo = getRepository(Service);
            const category = await categoryRepo.find({ where: { parent_category_id: req.params.name, is_deleted: false } })
            let result = []
            if (category.length > 0) {
                let data = await serviceRepo.createQueryBuilder("services")
                    .select(["services"])
                    .where("services.sub_services_id IN(:...ids)", { ids: category.map((category) => category.id) })
                    .getMany()

                result = data.map((x) => {
                    return {
                        id: x.id,
                        main_service: x.main_service,
                        sub_services_id: x.sub_services_id,
                        sub_services: x.sub_services,
                        title: x.title,
                        description: x.description,
                        image: {
                            displayImage: x.image != "" ? `${process.env.Image_Url}` + x.image : "",
                            image: x.image
                        },
                        title_second: x.title_second,
                        description_second: x.description_second,
                        image_second: {
                            displayImage: x.image_second != "" ? `${process.env.Image_Url}` + x.image_second : "",
                            image: x.image_second
                        },
                    }
                })
            }
            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(result, "Services get successfully.", httpStatus.OK)
                    );
            }

            throw new Error("Services not found.");

        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        null,
                        "Services not Exists",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    }
}


export {
    addService,
    editServices,
    getAllServices,
    getServicesById,
    deleteServicesById,
    getServicesBySubId,
    getAllServicesByName
}