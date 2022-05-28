import { celebrate } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import Joi from "joi";
import moment from "moment";
import { getRepository } from "typeorm";
import APIResponse from "../../utils/APIResponse";
import OurClient from "../entity/ourClient";

const addClient = {
    validator: celebrate({
        body: Joi.object().keys({
            clientInfo: Joi.string().required(),
            image: Joi.string().required(),
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const clientRepo = getRepository(OurClient)
            const newClient = {
                clientInfo: req.body.clientInfo,
                image: req.body.image,
            };
            const clientInstance = clientRepo.create(newClient);
            let result = await clientRepo.save(clientInstance);
            result = JSON.parse(JSON.stringify(result));

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "Client added Succesfully", 200));
            }
            throw new Error("Client Not Added");
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


const editClient = {
    validator: celebrate({
        body: Joi.object().keys({
            clientInfo: Joi.string().required(),
            image: Joi.string().required(),
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const clientRepo = getRepository(OurClient)

            const checkClient = await clientRepo.findOne({ where: { id: req.params.id, is_deleted: false } })


            if (!checkClient) {
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .json(
                        new APIResponse(
                            null,
                            "Client not found",
                            httpStatus.BAD_REQUEST,
                            httpStatus.BAD_REQUEST
                        )
                    );
            }

            const newClient = {
                clientInfo: req.body.clientInfo,
                image: req.body.image,
            };

            clientRepo.merge(checkClient, newClient)

            let result = await clientRepo.save(checkClient)
            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "Client edit Succesfully", 200));
            }

            throw new Error("Client Not Added");
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


const deleteClientById = {
    validator: celebrate({
        body: Joi.object().keys({
            id: Joi.string().required(),
        })
    }),

    controller: async (req: any, res: Response): Promise<Response> => {
        try {
            const clientRepo = getRepository(OurClient)
            const results = await clientRepo
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
                    .json(new APIResponse(null, "Client Deleted", httpStatus.OK));
            }
            throw new Error("Client not Exists");
        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        null,
                        "Client not Exists",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    },
}


const getAllClient = {
    validator: celebrate({
        query: Joi.object().keys({
            per_page: Joi.number().required(),
            page_number: Joi.number().required(),
        }),
    }),

    controller: async (req: any, res: Response): Promise<Response> => {
        try {
            const clientRepo = getRepository(OurClient)

            let query;

            query = clientRepo
                .createQueryBuilder("our_client")
                .select(["our_client"])

            const [our_client, count] = await query
                .where("our_client.is_deleted = :deleted", {
                    deleted: false,
                })
                .orderBy("our_client.created_at", "DESC")
                .skip(req.query.per_page * (req.query.page_number - 1))
                .take(req.query.per_page)
                .getManyAndCount();

            const AllCount = await clientRepo
                .createQueryBuilder("our_client")
                .andWhere("our_client.is_deleted = :deleted", {
                    deleted: false,
                })
                .getCount();

            let ItemArray = [];

            for await (const x of our_client) {
                ItemArray.push({
                    id: x.id,
                    clientInfo: x.clientInfo,
                    image: x.image != "" ? `${process.env.Image_Url}` + x.image : "",
                    created_at: moment(x.created_at).format("YYYY.MM.DD"),
                })
            }

            const result = {
                client: ItemArray,
                count: count,
                AllCount: AllCount,
            };

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(result, "Client get successfully.", httpStatus.OK)
                    );
            }

            throw new Error("Client not found.");

        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        null,
                        "Client not Exists",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    }
}


const getClientById = {
    validator: celebrate({
        params: Joi.object().keys({
            id: Joi.string().required(),
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const clientRepo = getRepository(OurClient)
            const client = await clientRepo.findOne({ where: { id: req.params.id, is_deleted: false } })
            let result = {}
            if (client == null || client == undefined) {
                result = {}
            } else {
                result = await {
                    id: client.id,
                    clientInfo: client.clientInfo,
                    image: {
                        displayImage: client.image != "" ? `${process.env.Image_Url}` + client.image : "",
                        image: client.image
                    },
                    created_at: moment(client.created_at).format("YYYY.MM.DD"),
                }
            }
            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(result, "Client get successfully.", httpStatus.OK)
                    );
            }
            throw new Error("Client not found.");
        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        null,
                        "Client not Exists",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    }
}

export {
    addClient,
    editClient,
    deleteClientById,
    getAllClient,
    getClientById
}