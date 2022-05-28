import { celebrate } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import Joi from "joi";
import { getRepository } from "typeorm";
import APIResponse from "../../utils/APIResponse";
import { MemberType } from "../../utils/constant";
import CareerRequest from "../entity/careerRequest";
import CareerRequirement from "../entity/careerRequirement";
import Team from "../entity/team";

const addCareerRequirement = {
  validator: celebrate({
    body: Joi.object().keys({
      position: Joi.string().required(),
      requirement: Joi.string().required(),
      experience: Joi.string().required(),
    })
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const careerRequirementRepo = getRepository(CareerRequirement);

      const newCareerRequirement = {
        position: req.body.position,
        experience: req.body.experience,
        requirement: req.body.requirement
      };

      const careerRequirement = careerRequirementRepo.create(newCareerRequirement);
      let result = await careerRequirementRepo.save(careerRequirement);
      result = JSON.parse(JSON.stringify(result));

      if (result) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse({}, "Career Requirement added Succesfully", 200));
      }

      throw new Error("Career Requirement Not Added");
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

const editCareerRequirement = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  validator: celebrate({
    body: Joi.object().keys({
      position: Joi.string().required(),
      requirement: Joi.string().required(),
      experience: Joi.string().required(),
    })
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const careerRequirementRepo = getRepository(CareerRequirement);

      const checkCareerRequirement = await careerRequirementRepo.findOne({ where: { id: req.params.id, is_deleted: false } });

      if (!checkCareerRequirement) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Career Requirement not found",
              httpStatus.BAD_REQUEST,
              httpStatus.BAD_REQUEST
            )
          );
      }


      const newCareerRequirement = {
        position: req.body.position,
        experience: req.body.experience,
        requirement: req.body.requirement
      };

      careerRequirementRepo.merge(checkCareerRequirement, newCareerRequirement);
      const result = await careerRequirementRepo.save(checkCareerRequirement);

      if (result) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse({}, "Career Requirement edit Succesfully", 200));
      }

      throw new Error("Career Requirement Not Added");
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

const careerRequirementById = {
  validator: celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const careerRequirementRepo = getRepository(CareerRequirement);

      const careerRequirement = await careerRequirementRepo
        .createQueryBuilder("career_requirement")
        .select(["career_requirement"])
        .where(`career_requirement.id = '${req.params.id}'`)
        .andWhere("career_requirement.is_deleted = :is_deleted", {
          is_deleted: false,
        })
        .getOne();

      if (careerRequirement) {
        let newcareerRequirement;
        newcareerRequirement = {
          position: careerRequirement.position,
          requirement: careerRequirement.requirement,
          experience: careerRequirement.experience

        };
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(newcareerRequirement, "Career Requirement get successfully.", httpStatus.OK)
          );
      }

      throw new Error("Career Requirement not found.");
    } catch (error) {
      return res
        .status(404)
        .json(
          new APIResponse(
            null,
            "Cannot get Career Requirement.",
            httpStatus.NOT_FOUND,
            error
          )
        );
    }
  },
};


const deleteCareerRequirement = {
  validator: celebrate({
    body: Joi.object().keys({
      id: Joi.string().required(),
    })
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const careerRequirementRepo = getRepository(CareerRequirement);

      const results = await careerRequirementRepo
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
          .json(new APIResponse(null, "Career Requirement Deleted", httpStatus.OK));
      }
      throw new Error("Career Requirement not Exists");
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Career Requirement not Exists",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};


const getCareerRequirementByUser = {

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const careerRequirementRepo = getRepository(CareerRequirement);

      let query;

      query = careerRequirementRepo
        .createQueryBuilder("career_requirement")
        .select(["career_requirement"])
        .where("career_requirement.is_deleted = :deleted", {
          deleted: false,
        })

      const careerRequirement = await query
        .getMany();


      if (careerRequirement) {
        const result = {
          careerRequirement: careerRequirement.map(x => {
            return {
              id: x.id,
              position: x.position,
              requirement: x.requirement,
              experience: x.experience
            }
          })
        };


        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(result, "Career Requirement get successfully.", httpStatus.OK)
          );
      }

      throw new Error("Career Requirement not found.");
    } catch (error) {
      return res
        .status(404)
        .json(
          new APIResponse(
            null,
            "Cannot get Career Requirement.",
            httpStatus.NOT_FOUND,
            error
          )
        );
    }
  },
};

const getFilteredCareerRequirement = {
  validator: celebrate({
    query: Joi.object().keys({
      search_term: Joi.string().allow(null, ""),
      per_page: Joi.number().required(),
      page_number: Joi.number().required()
    }),
  }),


  controller: async (req: any, res: Response): Promise<Response> => {

    try {
      const careerRequirementRepo = getRepository(CareerRequirement);

      let conditions = [];

      Object.keys(req.query).map((query) => {
        switch (query) {
          case "search_term":
            if (!req.query.search_term) break;
            req.query.search_term.split(" ").map((x: string) => {
              conditions.push(
                `(career_requirement.position ILIKE '%${x}%' OR career_requirement.requirement ILIKE '%${x}%' OR career_requirement.experience ILIKE '%${x}%')`
              );
            });
            break;
        }
      });

      let query;

      query = careerRequirementRepo
        .createQueryBuilder("career_requirement")
        .select(["career_requirement"])


      conditions.map((x, i) => {
        if (!i) {
          query = query.where(x);
        } else {
          query = query.andWhere(x);
        }
      });

      const [careerRequirement, count] = await query
        .andWhere("career_requirement.is_deleted = :deleted", {
          deleted: false,
        })
        .orderBy("career_requirement.created_at", "DESC")
        .skip(req.query.per_page * (req.query.page_number - 1))
        .take(req.query.per_page)
        .getManyAndCount();

      const AllCount = await careerRequirementRepo
        .createQueryBuilder("career_requirement")
        .andWhere("career_requirement.is_deleted = :deleted", {
          deleted: false,
        })
        .getCount();

      let ItemArray = [];

      for await (const careerrequirement of careerRequirement) {
        ItemArray.push({
          id: careerrequirement.id,
          position: careerrequirement.position,
          requirement: careerrequirement.requirement,
          experience: careerrequirement.experience
        })
      }

      const result = {
        careerRequirement: ItemArray,
        count: count,
        AllCount: AllCount,
      };
      if (result) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(result, "Career Requirement get successfully.", httpStatus.OK)
          );
      }
    } catch (err) {
      console.log(err)
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            err,
            "Error in getting Career Requirement",
            httpStatus.INTERNAL_SERVER_ERROR
          )
        );
    }
  },
};

const addCareerRequest = {
  validator: celebrate({
    body: Joi.object().keys({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      career_requirement: Joi.string().required(),
      experiance: Joi.string().required(),
      current_company: Joi.string().required(),
      resume: Joi.string().required(),
    })
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const careerRequestRepo = getRepository(CareerRequest);

      const newCareerRequest = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        career_requirement: req.body.career_requirement,
        experiance: req.body.experiance,
        current_company: req.body.current_company,
        resume: req.body.resume
      };

      const careerRequest = careerRequestRepo.create(newCareerRequest);
      let result = await careerRequestRepo.save(careerRequest);
      result = JSON.parse(JSON.stringify(result));

      if (result) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse({}, "Career Request added Succesfully", 200));
      }

      throw new Error("Career Request Not Added");
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

const getFilteredCareerRequest = {
  validator: celebrate({
    query: Joi.object().keys({
      search_term: Joi.string().allow(null, ""),
      per_page: Joi.number().required(),
      page_number: Joi.number().required()
    }),
  }),


  controller: async (req: any, res: Response): Promise<Response> => {

    try {
      const careerRequestRepo = getRepository(CareerRequest);

      let conditions = [];

      Object.keys(req.query).map((query) => {
        switch (query) {
          case "search_term":
            if (!req.query.search_term) break;
            if (req.query.search_term != "" || req.query.search_term != null) {
              req.query.search_term.split(" ").map((x: string) => {
                conditions.push(
                  `(career_request.last_name ILIKE '%${x}%' OR career_request.first_name ILIKE '%${x}%')`
                );
              });
            }
            break;
        }
      });

      let query;

      query = careerRequestRepo
        .createQueryBuilder("career_request")
        .select(["career_request"])
        .where("career_request.is_deleted = :deleted", {
          deleted: false,
        })

      conditions.map((x, i) => {
        if (!i) {
          query = query.where(x);
        } else {
          query = query.andWhere(x);
        }
      });

      console.log(query.getQuery())

      const [careerRequest, count] = await query

        .orderBy("career_request.created_at", "DESC")
        .skip(req.query.per_page * (req.query.page_number - 1))
        .take(req.query.per_page)
        .getManyAndCount();

      const AllCount = await careerRequestRepo
        .createQueryBuilder("career_request")
        .andWhere("career_request.is_deleted = :deleted", {
          deleted: false,
        })
        .getCount();

      let ItemArray = [];

      console.log(careerRequest)

      for await (const careerrequest of careerRequest) {
        ItemArray.push({
          id: careerrequest.id,
          position: careerrequest.first_name + " " + careerrequest.last_name,
          career_requirement: await GetcareerRequirementValueByID(careerrequest.career_requirement),
          experience: careerrequest.experience,
          current_company: careerrequest.current_company,
          resume: careerrequest.resume != "" ? `${process.env.Image_Url}` + careerrequest.resume : "",
        })
      }

      const result = {
        careerrequest: ItemArray,
        count: count,
        AllCount: AllCount,
      };
      if (result) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(result, "Career Request get successfully.", httpStatus.OK)
          );
      }
    } catch (err) {
      console.log(err)
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            err,
            "Error in getting Career Request",
            httpStatus.INTERNAL_SERVER_ERROR
          )
        );
    }
  },
};

function GetcareerRequirementValueByID(careerRequirementID: string) {
  return new Promise(async (resolve, reject) => {

    try {
      let returnData = "";

      const careerRequirementRepo = getRepository(CareerRequirement)
      let query = careerRequirementRepo
        .createQueryBuilder("career_requirement")
        .where("id = :ids", { ids: careerRequirementID })


      const careerRequirement = await query.getOne();

      if (careerRequirement) {
        returnData = careerRequirement.position;
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
  addCareerRequirement,
  editCareerRequirement,
  careerRequirementById,
  deleteCareerRequirement,
  getCareerRequirementByUser,
  getFilteredCareerRequirement,
  addCareerRequest,
  getFilteredCareerRequest
}