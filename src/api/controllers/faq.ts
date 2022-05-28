import { celebrate } from "celebrate";
import Joi from "joi";
import { getRepository } from 'typeorm';
import { Faq } from "../entity";
import httpStatus from "http-status";
import APIResponse from "../../utils/APIResponse";
import { Request, Response } from "express";







const addFAQ = {
    validator: celebrate({
        body: Joi.object().keys({
            question: Joi.string().required(),
            answer: Joi.string().required(),
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const faqRepo = getRepository(Faq);


            const newFaq = {
                question: req.body.question,
                answer: req.body.answer,
            };



            const faqSection = faqRepo.create(newFaq);
            let result = await faqRepo.save(faqSection);
            result = JSON.parse(JSON.stringify(result));

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "Faq Section added Succesfully", 200));
            }

            throw new Error("Faq Section Not Added");
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

const getFAQ = {
    validator: celebrate({
        query: Joi.object().keys({
            per_page: Joi.number().required(),
            page_number: Joi.number().required(),
        }),
    }),

    controller: async (req: any, res: any): Promise<Response> => {
        try {
            const faqRepo = getRepository(Faq);

            const query = faqRepo.createQueryBuilder("faq").select(["faq"]);

            let faq, count;

            [faq, count] = await query
                .skip(req.query.per_page * (req.query.page_number - 1))
                .take(req.query.per_page)
                .where("faq.is_deleted = :is_deleted", {
                    is_deleted: false,
                })
                .getManyAndCount();

            if (faq) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(
                            { faq, count },
                            "Faq get succesfully",
                            httpStatus.OK
                        )
                    );
            }
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(new APIResponse(null, "Cannot get faq", httpStatus.BAD_REQUEST));
        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(null, "Cannot get faq", httpStatus.BAD_REQUEST, error)
                );
        }
    },
};


const getByIdFAQ = {
    validator: celebrate({
        params: Joi.object().keys({
            id: Joi.string().required(),
        })
    }),

    controller: async (req: any, res: any): Promise<Response> => {
        try {
            const faqRepo = getRepository(Faq);
            const faq = await faqRepo
                .createQueryBuilder("faq")
                .select("faq")
                .where(`faq.id = '${req.params.id}'`)
                .andWhere("faq.is_deleted = :is_deleted", {
                    is_deleted: false,
                })
                .getOne();

            if (faq) {
                let newFaq = {
                    id: faq.id,
                    question: faq.question,
                    answer: faq.answer,
                };
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(
                            newFaq,
                            "Faq get succesfully",
                            httpStatus.OK
                        )
                    );
            }
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(new APIResponse(null, "Cannot get faq", httpStatus.BAD_REQUEST));
        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(null, "Cannot get faq", httpStatus.BAD_REQUEST, error)
                );
        }
    },
};

const editFAQ = {
    validator: celebrate({
        params: Joi.object().keys({
            id: Joi.string().required(),
        })
    }),

    controller: async (req: any, res: any): Promise<Response> => {
        try {
            const faqRepo = getRepository(Faq);
            const checkFaq = await faqRepo.findOne({ where: { id: req.params.id, is_deleted: false } });


            if (!checkFaq) {
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .json(
                        new APIResponse(
                            null,
                            "faq not found",
                            httpStatus.BAD_REQUEST,
                            httpStatus.BAD_REQUEST
                        )
                    );
            }

            const newFaq = {
                question: req.body.question,
                answer: req.body.answer,
                is_deleted: false
            };

            faqRepo.merge(checkFaq, newFaq);
            const result = await faqRepo.save(checkFaq);

            if (result) {

                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(
                            newFaq,
                            "Faq edit succesfully",
                            httpStatus.OK
                        )
                    );
            }
        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(null, "Cannot get faq", httpStatus.BAD_REQUEST, error)
                );
        }
    },
};


const deleteFAQ = {
    validator: celebrate({
        body: Joi.object().keys({
            id: Joi.string().required(),
        })
    }),

    controller: async (req: any, res: any): Promise<Response> => {
        try {
            const faqRepo = getRepository(Faq);
            const results = await faqRepo
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
                    .json(new APIResponse(null, "faq Deleted", httpStatus.OK));
            }


        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(null, "Cannot get faq", httpStatus.BAD_REQUEST, error)
                );
        }
    },
};


const getNoAuthFAQ = {
    validator: celebrate({
        query: Joi.object().keys({
            per_page: Joi.number().required(),
            page_number: Joi.number().required(),
        }),
    }),

    controller: async (req: any, res: any): Promise<Response> => {
        try {
            const faqRepo = getRepository(Faq);

            const query = faqRepo.createQueryBuilder("faq").select(["faq"]);

            let faq, count;

            [faq, count] = await query
                .skip(req.query.per_page * (req.query.page_number - 1))
                .take(req.query.per_page)
                .where("faq.is_deleted = :is_deleted", {
                    is_deleted: false,
                })
                .getManyAndCount();

            if (faq) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(
                            { faq, count },
                            "Faq get succesfully",
                            httpStatus.OK
                        )
                    );
            }
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(new APIResponse(null, "Cannot get faq", httpStatus.BAD_REQUEST));
        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(null, "Cannot get faq", httpStatus.BAD_REQUEST, error)
                );
        }
    },
};
export {
    getFAQ,
    addFAQ,
    getByIdFAQ,
    editFAQ,
    deleteFAQ,
    getNoAuthFAQ
}