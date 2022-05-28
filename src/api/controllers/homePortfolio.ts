import { celebrate } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import Joi, { x } from "joi";
import { getRepository } from "typeorm";
import APIResponse from "../../utils/APIResponse";
import { HomePortfolio } from "../entity";



const addHomePortfolio = {
    validator: celebrate({
        body: Joi.object().keys({
            title: Joi.string().required(),
            description: Joi.string().required()
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {

        try {
            const portfolioSectionRepo = getRepository(HomePortfolio);
            const results = await portfolioSectionRepo
                .createQueryBuilder("homepage_portfolio")
                .delete()
                .execute();


            const newPortfolioSection = {
                title: req.body.title,
                description: req.body.description
            };

            const portfolioSection = portfolioSectionRepo.create(newPortfolioSection);
            let result = await portfolioSectionRepo.save(portfolioSection);
            result = JSON.parse(JSON.stringify(result));

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "Portfolio Section added Succesfully", 200));
            }

            throw new Error("Portfolio Section Not Added");
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


const getHomePortfolio = {
    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const portfolioSectionRepo = getRepository(HomePortfolio);

            const portfolioSection = await portfolioSectionRepo.findOne();

            let result = {
                title: portfolioSection.title,
                description: portfolioSection.description
            }

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(result, "Homepage Portfolio Section get successfully", httpStatus.OK)
                    );
            }

        } catch (error) {
            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get Homepage Portfolio Section",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};




export {
    addHomePortfolio,
    getHomePortfolio
}