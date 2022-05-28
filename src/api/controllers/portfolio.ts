import { celebrate } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import Joi from "joi";
import { getRepository } from "typeorm";
import APIResponse from "../../utils/APIResponse";
import { Category } from "../entity";
import Portfolio from "../entity/portfolio";

const addCompanyPortfolio = {
  validator: celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      introduction: Joi.string().required(),
      key_features: Joi.array().items(Joi.string().required()),
      technical_overview: Joi.string().required(),
      main_image: Joi.string().required(),
      image: Joi.string().required(),
    })
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const portfolioRepo = getRepository(Portfolio);

      const newPortfolio = {
        name: req.body.name,
        introduction: req.body.introduction,
        key_features: req.body.key_features.map((da: any) => da).join(','),
        technical_overview: req.body.technical_overview,
        main_image: req.body.main_image,
        image: req.body.image,
        is_deleted: false
      };

      const portfolio = portfolioRepo.create(newPortfolio);
      let result = await portfolioRepo.save(portfolio);
      result = JSON.parse(JSON.stringify(result));

      if (result) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse({}, "Portfolio added Succesfully", 200));
      }

      throw new Error("Portfolio Not Added");
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

const editCompanyPortfolio = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  validator: celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      introduction: Joi.string().required(),
      key_features: Joi.array().items(Joi.string().required()),
      technical_overview: Joi.string().required(),
      main_image: Joi.string().required(),
      image: Joi.string().required(),
    })
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const portfolioRepo = getRepository(Portfolio);

      const checkPortfolio = await portfolioRepo.findOne({ where: { id: req.params.id, is_deleted: false } });

      if (!checkPortfolio) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Protfolio not found",
              httpStatus.BAD_REQUEST,
              httpStatus.BAD_REQUEST
            )
          );
      }


      const newPortfolio = {
        name: req.body.name,
        introduction: req.body.introduction,
        key_features: req.body.key_features.map((da: any) => da).join(','),
        technical_overview: req.body.technical_overview,
        main_image: req.body.main_image,
        image: req.body.image,
        is_deleted: false
      };

      portfolioRepo.merge(checkPortfolio, newPortfolio);
      const result = await portfolioRepo.save(checkPortfolio);

      // const portfolio = portfolioRepo.create(newPortfolio);
      // let result = await portfolioRepo.save(portfolio);
      // result = JSON.parse(JSON.stringify(result));

      if (result) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse({}, "Portfolio edit Succesfully", 200));
      }

      throw new Error("Portfolio Not Added");
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

const portfolioById = {
  validator: celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const portfolioRepo = getRepository(Portfolio);

      const portfolio = await portfolioRepo
        .createQueryBuilder("portfolio")
        .select(["portfolio"])
        .where(`portfolio.id = '${req.params.id}'`)
        .andWhere("portfolio.is_deleted = :is_deleted", {
          is_deleted: false,
        })
        .getOne();

      if (portfolio) {
        let newPortfolio;
        newPortfolio = {
          id: portfolio.id,
          name: portfolio.name,
          introduction: portfolio.introduction,
          key_features: portfolio.key_features,
          technical_overview: portfolio.technical_overview,
          main_image: {
            displayImage: portfolio.main_image != "" ? `${process.env.Image_Url}` + portfolio.main_image : "",
            image: portfolio.main_image
          },
          image: portfolio.image != "" ? portfolio.image.split(',').map(x => {
            return {
              displayImage: `${process.env.Image_Url}` + x,
              image: x
            }
          }) : []
        };
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(newPortfolio, "Portfolio get successfully.", httpStatus.OK)
          );
      }

      throw new Error("Portfolio not found.");
    } catch (error) {
      return res
        .status(404)
        .json(
          new APIResponse(
            null,
            "Cannot get Portfolio.",
            httpStatus.NOT_FOUND,
            error
          )
        );
    }
  },
};


const deletePortfolio = {
  validator: celebrate({
    body: Joi.object().keys({
      id: Joi.string().required(),
    })
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const portfolioRepo = getRepository(Portfolio);

      const results = await portfolioRepo
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
          .json(new APIResponse(null, "Portfolio Deleted", httpStatus.OK));
      }
      throw new Error("Portfolio not Exists");
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Portfolio not Exists",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};


const getPortfolioByUser = {
  validator: celebrate({
    params: Joi.object().keys({
      categoryId: Joi.string().allow("").required(),
    }),
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const portfolioRepo = getRepository(Portfolio);
      let qureyPortfolioData
      qureyPortfolioData = portfolioRepo
        .createQueryBuilder()
        .where("is_deleted = :is_deleted", { is_deleted: false })

      if (req.params.categoryId !== "All") {
        qureyPortfolioData = qureyPortfolioData
          .andWhere("technical_overview SIMILAR TO :ids", { ids: `%(${req.params.categoryId})%` })
      }

      let portfolioData = await qureyPortfolioData
        .getMany();

      if (portfolioData) {
        let ItemArray = [];

        for await (const portfolio of portfolioData) {
          ItemArray.push({
            id: portfolio.id,
            name: portfolio.name,
            introduction: portfolio.introduction,
            key_features: portfolio.key_features,
            technical_overview: await GetCategoryValueByID(portfolio.technical_overview),
            main_image: {
              displayImage: portfolio.main_image != "" ? `${process.env.Image_Url}` + portfolio.main_image : "",
              image: portfolio.main_image
            },
            image: portfolio.image != "" ? portfolio.image.split(',').map(x => {
              return {
                displayImage: `${process.env.Image_Url}` + x,
                image: x
              }
            }) : [],
            created_at: portfolio.created_at
          })
        }
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(ItemArray, "Portfolio get successfully.", httpStatus.OK)
          );
      }

      throw new Error("Portfolio not found.");
    } catch (error) {
      return res
        .status(404)
        .json(
          new APIResponse(
            null,
            "Cannot get Portfolio.",
            httpStatus.NOT_FOUND,
            error
          )
        );
    }
  },
};

const getFilteredPortfolio = {
  validator: celebrate({
    query: Joi.object().keys({
      search_term: Joi.string().allow(null, ""),
      per_page: Joi.number().required(),
      page_number: Joi.number().required()
    }),
  }),


  controller: async (req: any, res: Response): Promise<Response> => {

    try {
      const portfolioRepo = getRepository(Portfolio);

      let conditions = [];

      Object.keys(req.query).map((query) => {
        switch (query) {
          case "search_term":
            if (!req.query.search_term) break;
            req.query.search_term.split(" ").map((x: string) => {
              conditions.push(
                `(portfolio.name ILIKE '%${x}%' OR portfolio.key_features ILIKE '%${x}%' OR portfolio.technical_overview ILIKE '%${x}%' OR portfolio.introduction ILIKE '%${x}%')`
              );
            });
            break;
        }
      });

      let query;

      query = portfolioRepo
        .createQueryBuilder("portfolio")
        .select(["portfolio"])


      conditions.map((x, i) => {
        if (!i) {
          query = query.where(x);
        } else {
          query = query.andWhere(x);
        }
      });

      const [portfolios, count] = await query
        .andWhere("portfolio.is_deleted = :deleted", {
          deleted: false,
        })
        .orderBy("portfolio.created_at", "DESC")
        .skip(req.query.per_page * (req.query.page_number - 1))
        .take(req.query.per_page)
        .getManyAndCount();

      const AllCount = await portfolioRepo
        .createQueryBuilder("portfolio")
        .andWhere("portfolio.is_deleted = :deleted", {
          deleted: false,
        })
        .getCount();

      let ItemArray = [];

      for await (const portfolio of portfolios) {
        ItemArray.push({
          id: portfolio.id,
          name: portfolio.name,
          introduction: portfolio.introduction,
          key_features: portfolio.key_features,
          technical_overview: await GetCategoryValueByID(portfolio.technical_overview),
          main_image: {
            displayImage: portfolio.main_image != "" ? `${process.env.Image_Url}` + portfolio.main_image : "",
            image: portfolio.main_image
          },
          image: portfolio.image != "" ? portfolio.image.split(',').map(x => {
            return {
              displayImage: `${process.env.Image_Url}` + x,
              image: x
            }
          }) : [],
          created_at: portfolio.created_at
        })
      }
      const result = {
        portfolios: ItemArray,
        count: count,
        AllCount: AllCount,
      };
      if (result) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(result, "Portfolio get successfully.", httpStatus.OK)
          );
      }
    } catch (err) {

      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            err,
            "Error in getting portfolio",
            httpStatus.INTERNAL_SERVER_ERROR
          )
        );
    }
  },
};


function GetCategoryValueByID(CategoryID: string) {
  return new Promise(async (resolve, reject) => {

    try {
      let returnData = "";

      const categoryRepo = getRepository(Category)


      let query = categoryRepo
        .createQueryBuilder("category")
        .where("id IN(:...ids)", { ids: CategoryID.split(',').map((x) => x) })


      const categoryData = await query.getMany();

      if (categoryData.length > 0) {
        returnData = categoryData.map(x => x.category).join(',');
      } else {
        returnData = ""
      }

      resolve(returnData);
    } catch (e) {
      reject(e);
    }

  });
}



export {
  addCompanyPortfolio,
  editCompanyPortfolio,
  portfolioById,
  deletePortfolio,
  getPortfolioByUser,
  getFilteredPortfolio
}