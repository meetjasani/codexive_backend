

import { celebrate } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import Joi, { x } from "joi";
import { getRepository } from "typeorm";
import APIResponse from "../../utils/APIResponse";
import { ServicesDetails } from "../entity";

const addsevicesDetails = {
    validator: celebrate({
        body: Joi.object().keys({
            title: Joi.string().required(),
            description: Joi.string().required(),
            details: Joi.string().required(),
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const servicesDetailsRepo = getRepository(ServicesDetails);
            const results = await servicesDetailsRepo
                .createQueryBuilder("services_detail")
                .delete()
                .execute();

            const newServicesDetails = {
                title: req.body.title,
                description: req.body.description,
                details: req.body.details,
                is_deleted: false
            };

            const heroSection = servicesDetailsRepo.create(newServicesDetails);
            let result = await servicesDetailsRepo.save(heroSection);
            result = JSON.parse(JSON.stringify(result));

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "Services Details Section added Succesfully", 200));
            }

            throw new Error("Services Details Section Not Added");
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


const getServicesDetails = {
    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const servicesDetailsRepo = getRepository(ServicesDetails);

            const servicesDetailsSection = await servicesDetailsRepo.findOne();



            if (servicesDetailsSection) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(servicesDetailsSection, "Services Details Section get successfully", httpStatus.OK)
                    );
            }

        } catch (error) {
            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get Services Details Section",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};


const getNoAuthServicesDetails = {
    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const servicesDetailsRepo = getRepository(ServicesDetails);

            const servicesDetailsSection = await servicesDetailsRepo.findOne();



            if (servicesDetailsSection) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(servicesDetailsSection, "Services Details Section get successfully", httpStatus.OK)
                    );
            }

        } catch (error) {
            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get Services Details Section",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};


export {
    addsevicesDetails,
    getServicesDetails,
    getNoAuthServicesDetails
}