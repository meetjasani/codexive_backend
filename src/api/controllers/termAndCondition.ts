import { celebrate } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import Joi, { x } from "joi";
import { getRepository } from "typeorm";
import APIResponse from "../../utils/APIResponse";
import { TermAndCondition } from "../entity";



const addTermAndCondition = {
    validator: celebrate({
        body: Joi.object().keys({
            details: Joi.string().required()
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {

        try {
            const conditionSectionRepo = getRepository(TermAndCondition);
            const results = await conditionSectionRepo
                .createQueryBuilder("term_and_condition")
                .delete()
                .execute();


            const newTermSection = {
                details: req.body.details,
            };

            const termSection = conditionSectionRepo.create(newTermSection);
            let result = await conditionSectionRepo.save(termSection);
            result = JSON.parse(JSON.stringify(result));

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "Term And Condition Section added Succesfully", 200));
            }

            throw new Error("Term And Condition Section Not Added");
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


const getTermAndCondition = {
    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const conditionSectionRepo = getRepository(TermAndCondition);

            const termSection = await conditionSectionRepo.findOne();

            let result = {
                details: termSection.details,
            }

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(result, "Term And Condition Section get successfully", httpStatus.OK)
                    );
            }

        } catch (error) {
            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get Term And Condition Section",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};

const getNoAuthTermAndCondition = {
    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const conditionSectionRepo = getRepository(TermAndCondition);

            const termSection = await conditionSectionRepo.findOne();

            let result = {
                details: termSection.details,
            }

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(result, "Term And Condition Section get successfully", httpStatus.OK)
                    );
            }

        } catch (error) {
            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get Term And Condition Section",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};


export {
    addTermAndCondition,
    getTermAndCondition,
    getNoAuthTermAndCondition
}