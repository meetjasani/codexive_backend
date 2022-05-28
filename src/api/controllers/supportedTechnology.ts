import { celebrate } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import Joi, { x } from "joi";
import { getRepository } from "typeorm";
import APIResponse from "../../utils/APIResponse";
import { SupportedTechnology } from "../entity";
import HowWorkSection from '../entity/howWorkSection';




const addSupportedTechnology = {
    validator: celebrate({
        body: {
            technology: Joi.array().items(Joi.object().keys({
                title: Joi.string().required(),
                image: Joi.string().required(),
            }))
        }
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {

        try {
            const supportedRepo = getRepository(SupportedTechnology);

            const results = await supportedRepo
                .createQueryBuilder("supported_technology")
                .delete()
                .execute();

            let data = [];

            data.push(req.body.technology.map((x: any) => {
                return supportedRepo.save(supportedRepo.create(x))
            }))

            await Promise.all(data);

            if (data) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "Supported Technology added Succesfully", 200));
            }

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


const getSupportedTechnology = {
    controller: async (req: Request, res: Response): Promise<Response> => {
        try {

            const supportedRepo = getRepository(SupportedTechnology);
            const technologySection = await supportedRepo.find();
            let result = technologySection.map((x) => {
                return {
                    id: x.id,
                    title: x.title,
                    image: {
                        displayImage: x.image ? `${process.env.Image_Url}` + x.image : "",
                        image: x.image ? x.image : ""
                    }
                }
            })
            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(result, "Supported Technology get successfully", httpStatus.OK)
                    );
            }


        } catch (error) {
            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get Supported Technology",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};



const getNoAuthSupportedTechnology = {
    controller: async (req: Request, res: Response): Promise<Response> => {
        try {

            const supportedRepo = getRepository(SupportedTechnology);
            const technologySection = await supportedRepo.find();
            let result = technologySection.map((x) => {
                return {
                    id: x.id,
                    title: x.title,
                    image: x.image ? `${process.env.Image_Url}` + x.image : ""
                }
            })
            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(result, "Supported Technology get successfully", httpStatus.OK)
                    );
            }


        } catch (error) {
            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get Supported Technology",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};



export {
    addSupportedTechnology,
    getSupportedTechnology,
    getNoAuthSupportedTechnology
}