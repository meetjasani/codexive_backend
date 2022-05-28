import { celebrate } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import Joi, { x } from "joi";
import { getRepository } from "typeorm";
import APIResponse from "../../utils/APIResponse";
import { PrivacyPolicy } from "../entity";



const addPrivacyPolicy = {
    validator: celebrate({
        body: Joi.object().keys({
            details: Joi.string().required()
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {

        try {
            const privacySectionRepo = getRepository(PrivacyPolicy);
            const results = await privacySectionRepo
                .createQueryBuilder("privacy_policy")
                .delete()
                .execute();


            const newPrivacySection = {
                details: req.body.details,
            };

            const privacySection = privacySectionRepo.create(newPrivacySection);
            let result = await privacySectionRepo.save(privacySection);
            result = JSON.parse(JSON.stringify(result));

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "Privacy Policy Section added Succesfully", 200));
            }

            throw new Error("Privacy Policy Section Not Added");
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


const getPrivacyPolicy = {
    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const privacySectionRepo = getRepository(PrivacyPolicy);

            const privacySection = await privacySectionRepo.findOne();

            let result = {
                details: privacySection.details,
            }

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(result, "Privacy Policy Section get successfully", httpStatus.OK)
                    );
            }

        } catch (error) {
            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get Privacy Policy Section",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};

const getNoAuthPrivacyPolicy = {
    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const privacySectionRepo = getRepository(PrivacyPolicy);

            const privacySection = await privacySectionRepo.findOne();

            let result = {
                details: privacySection.details,
            }

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(result, "Privacy Policy Section get successfully", httpStatus.OK)
                    );
            }

        } catch (error) {
            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get Privacy Policy Section",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};


export {
    addPrivacyPolicy,
    getPrivacyPolicy,
    getNoAuthPrivacyPolicy
}