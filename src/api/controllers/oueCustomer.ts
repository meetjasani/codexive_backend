
import Joi from 'joi';
import { getRepository } from 'typeorm';
import OurCustomer from '../entity/ourCustomer';
import APIResponse from "../../utils/APIResponse";
import { celebrate } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";



const addOurCustomerSection = {
    validator: celebrate({
        body: Joi.object().keys({
            title: Joi.string().required(),
            description: Joi.string().required(),
            customer: Joi.array().items(Joi.object().keys({
                name: Joi.string().required(),
                image: Joi.string().required(),
                customer_title: Joi.string().required(),
                customer_description: Joi.string().required(),
            })),
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {

        try {
            const customerRepo = getRepository(OurCustomer);

            const results = await customerRepo
                .createQueryBuilder("our_customer")
                .delete()
                .execute();

            const newCustomerSection = {
                title: req.body.title,
                description: req.body.description,
                customer: JSON.stringify(req.body.customer),
            };

            const customerSection = customerRepo.create(newCustomerSection);
            let result = await customerRepo.save(customerSection);
            result = JSON.parse(JSON.stringify(result));

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "Our Customer Section added Succesfully", 200));
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


const getOurCustomerSection = {
    controller: async (req: Request, res: Response): Promise<Response> => {
        try {

            const customerRepo = getRepository(OurCustomer);
            const customerSection = await customerRepo
                .createQueryBuilder("our_customer")
                .select("our_customer")
                .getOne();
            let finalResult = {};
            if (customerSection) {

                let result = {
                    id: customerSection.id,
                    title: customerSection.title,
                    description: customerSection.description,
                    customer: JSON.parse(customerSection.customer),
                }

                let newResult = result.customer.map((x) => {
                    return {
                        name: x.name,
                        displayImage: x.image ? `${process.env.Image_Url}` + x.image : "",
                        image: x.image ? x.image : "",
                        customer_title: x.customer_title,
                        customer_description: x.customer_description
                    }
                })

                finalResult = {
                    ...result,
                    customer: newResult
                }


            }
            if (finalResult) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(finalResult, "Our Customer Section get successfully", httpStatus.OK)
                    );
            }


        } catch (error) {
            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get Our Customer Section",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};


const getNoAuthOurCustomerSection = {
    controller: async (req: Request, res: Response): Promise<Response> => {
        try {

            const customerRepo = getRepository(OurCustomer);
            const customerSection = await customerRepo.findOne();
            let finalResult = {};
            if (customerSection == null || customerSection == undefined) {
                finalResult = {}
            } else {
                let result = {
                    id: customerSection.id,
                    title: customerSection.title,
                    description: customerSection.description,
                    customer: JSON.parse(customerSection.customer),
                }

                let newResult = result.customer.map((x) => {
                    return {
                        name: x.name,
                        image: x.image ? `${process.env.Image_Url}` + x.image : "",
                        customer_title: x.customer_title,
                        customer_description: x.customer_description
                    }
                })

                finalResult = {
                    ...result,
                    customer: newResult
                }
            }


            if (finalResult) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(finalResult, "Our Customer Section get successfully", httpStatus.OK)
                    );
            }


        } catch (error) {
            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get Our Customer Section",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};



export {
    addOurCustomerSection,
    getOurCustomerSection,
    getNoAuthOurCustomerSection
}