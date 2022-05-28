import { celebrate } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import Joi from "joi";
import { getRepository } from "typeorm";
import APIResponse from "../../utils/APIResponse";
import { MemberType } from "../../utils/constant";
import Team from "../entity/team";

const addTeam = {
  validator: celebrate({
    body: Joi.object().keys({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      id_number: Joi.string().required(),
      image: Joi.string().required(),
      skill: Joi.string().required(),
      member_type: Joi.string().valid(...Object.values(MemberType)).required(),
    })
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const teamRepo = getRepository(Team);

      const newTeam = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        id_number: req.body.id_number,
        image: req.body.image,
        skill: req.body.skill,
        member_type: req.body.member_type,
        is_deleted: false
      };

      const team = teamRepo.create(newTeam);
      let result = await teamRepo.save(team);
      result = JSON.parse(JSON.stringify(result));

      if (result) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse({}, "Team added Succesfully", 200));
      }

      throw new Error("Team Not Added");
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

const editTeam = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  validator: celebrate({
    body: Joi.object().keys({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      id_number: Joi.string().required(),
      image: Joi.string().required(),
      skill: Joi.string().required(),
      member_type: Joi.string().valid(...Object.values(MemberType)).required(),
    })
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const teamRepo = getRepository(Team);

      const checkTeam = await teamRepo.findOne({ where: { id: req.params.id, is_deleted: false } });

      if (!checkTeam) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(
              null,
              "Team not found",
              httpStatus.BAD_REQUEST,
              httpStatus.BAD_REQUEST
            )
          );
      }


      const newTeam = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        id_number: req.body.id_number,
        image: req.body.image,
        skill: req.body.skill,
        member_type: req.body.member_type,
        is_deleted: false
      };

      teamRepo.merge(checkTeam, newTeam);
      const result = await teamRepo.save(checkTeam);

      if (result) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse({}, "Team edit Succesfully", 200));
      }

      throw new Error("Team Not Added");
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

const teamById = {
  validator: celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const teamRepo = getRepository(Team);

      const team = await teamRepo
        .createQueryBuilder("team")
        .select(["team"])
        .where(`team.id = '${req.params.id}'`)
        .andWhere("team.is_deleted = :is_deleted", {
          is_deleted: false,
        })
        .getOne();

      if (team) {
        let newteam;
        newteam = {
          first_name: team.first_name,
          last_name: team.last_name,
          id_number: team.id_number,
          image: team.image,
          display_image: team.image != "" ? `${process.env.Image_Url}` + team.image : "",
          skill: team.skill,
          member_type: team.member_type,

        };
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(newteam, "Team get successfully.", httpStatus.OK)
          );
      }

      throw new Error("Team not found.");
    } catch (error) {
      return res
        .status(404)
        .json(
          new APIResponse(
            null,
            "Cannot get Team.",
            httpStatus.NOT_FOUND,
            error
          )
        );
    }
  },
};


const deleteTeamMember = {
  validator: celebrate({
    body: Joi.object().keys({
      id: Joi.string().required(),
    })
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const teamRepo = getRepository(Team);

      const results = await teamRepo
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
          .json(new APIResponse(null, "Team Deleted", httpStatus.OK));
      }
      throw new Error("Team not Exists");
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Team not Exists",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};


const getTeamByUser = {
  validator: celebrate({
    query: Joi.object().keys({
      member_type: Joi.string().valid(...Object.values(MemberType)).allow(null, "")
    }),
  }),
  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const teamRepo = getRepository(Team);

      // const team = await teamRepo.find({ where: { is_deleted: false } });

      let query;

      query = teamRepo
        .createQueryBuilder("team")
        .select(["team"])
        .where("team.is_deleted = :deleted", {
          deleted: false,
        })

      if (req.query.member_type != "" || req.query.member_type != null) {
        query = query.andWhere("team.member_type = :member_type", {
          member_type: req.query.member_type,
        })
      }

      const team = await query
        .getMany();


      if (team) {
        const result = {
          team: team.map(x => {
            return {
              name: x.first_name + " " + x.last_name,
              image: x.image != "" ? `${process.env.Image_Url}` + x.image : "",
              skill: x.skill
            }
          })
        };


        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(result, "Team get successfully.", httpStatus.OK)
          );
      }

      throw new Error("Team not found.");
    } catch (error) {
      return res
        .status(404)
        .json(
          new APIResponse(
            null,
            "Cannot get Team.",
            httpStatus.NOT_FOUND,
            error
          )
        );
    }
  },
};

const getFilteredTeam = {
  validator: celebrate({
    query: Joi.object().keys({
      search_term: Joi.string().allow(null, ""),
      per_page: Joi.number().required(),
      page_number: Joi.number().required()
    }),
  }),


  controller: async (req: any, res: Response): Promise<Response> => {

    try {
      const teamRepo = getRepository(Team);

      let conditions = [];

      Object.keys(req.query).map((query) => {
        switch (query) {
          case "search_term":
            if (!req.query.search_term) break;
            req.query.search_term.split(" ").map((x: string) => {
              conditions.push(
                `(team.first_name ILIKE '%${x}%' OR team.last_name ILIKE '%${x}%')`
              );
            });
            break;
        }
      });

      let query;

      query = teamRepo
        .createQueryBuilder("team")
        .select(["team"])


      conditions.map((x, i) => {
        if (!i) {
          query = query.where(x);
        } else {
          query = query.andWhere(x);
        }
      });

      const [team, count] = await query
        .andWhere("team.is_deleted = :deleted", {
          deleted: false,
        })
        .orderBy("team.created_at", "DESC")
        .skip(req.query.per_page * (req.query.page_number - 1))
        .take(req.query.per_page)
        .getManyAndCount();

      const AllCount = await teamRepo
        .createQueryBuilder("team")
        .andWhere("team.is_deleted = :deleted", {
          deleted: false,
        })
        .getCount();

      let ItemArray = [];

      for await (const teams of team) {
        ItemArray.push({
          id: teams.id,
          first_name: teams.first_name,
          last_name: teams.last_name,
          id_number: teams.id_number,
          image: teams.image != "" ? `${process.env.Image_Url}` + teams.image : "",
          skill: teams.skill,
          member_type: teams.member_type
        })
      }

      const result = {
        team: ItemArray,
        count: count,
        AllCount: AllCount,
      };
      if (result) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(result, "Team get successfully.", httpStatus.OK)
          );
      }
    } catch (err) {
      console.log(err)
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            err,
            "Error in getting team",
            httpStatus.INTERNAL_SERVER_ERROR
          )
        );
    }
  },
};

export {
  addTeam,
  editTeam,
  teamById,
  deleteTeamMember,
  getTeamByUser,
  getFilteredTeam
}