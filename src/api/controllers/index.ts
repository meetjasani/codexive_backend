import { celebrate } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import Joi from "joi";
import { getRepository } from "typeorm";
import APIResponse from "../../utils/APIResponse";
import { uploadImage } from "../../utils/fileUpload";
import { CareerSetting, EmailSetting, Setting } from "../entity";
import ContectUs from "../entity/contectUs";

const fileAndImageUpload = {
  controller: async (req: any, res: Response): Promise<Response> => {
    try {

      if (req.files.length) {
        let image = await uploadImage(req.files[0]);
        return res.status(200).json({
          uploaded: true,
          url: image,
          display_url: `${process.env.Image_Url}` + image
        });
      }


    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in Image And File insert",
            httpStatus.BAD_REQUEST,
            error
          )
        );
    }
  },
};

const addContectUs = {
  validator: celebrate({
    body: Joi.object().keys({
      first_name: Joi.string().required(),
      email: Joi.string().required(),
      phone_no: Joi.string().required(),
      website: Joi.string().required(),
      message: Joi.string().required()
    })
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const contectUsRepo = getRepository(ContectUs);

      const newContectUs = {
        first_name: req.body.first_name,
        email: req.body.email,
        phone_no: req.body.phone_no,
        website: req.body.website,
        message: req.body.message,
      };

      const contectUs = contectUsRepo.create(newContectUs);
      let result = await contectUsRepo.save(contectUs);
      result = JSON.parse(JSON.stringify(result));

      if (result) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse({}, "Contect us added Succesfully", 200));
      }

      throw new Error("Contect us Not Added");
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

const getFilteredContectUs = {
  validator: celebrate({
    query: Joi.object().keys({
      search_term: Joi.string().allow(null, ""),
      per_page: Joi.number().required(),
      page_number: Joi.number().required()
    }),
  }),


  controller: async (req: any, res: Response): Promise<Response> => {

    try {
      const contectUsRepo = getRepository(ContectUs);

      let conditions = [];

      Object.keys(req.query).map((query) => {
        switch (query) {
          case "search_term":
            if (!req.query.search_term) break;
            req.query.search_term.split(" ").map((x: string) => {
              conditions.push(
                `(contect_us.first_name ILIKE '%${x}%' OR contect_us.email ILIKE '%${x}%' OR contect_us.phone_no ILIKE '%${x}%' OR contect_us.website ILIKE '%${x}%' OR contect_us.message ILIKE '%${x}%')`
              );
            });
            break;
        }
      });

      let query;

      query = contectUsRepo
        .createQueryBuilder("contect_us")
        .select(["contect_us"])


      conditions.map((x, i) => {
        if (!i) {
          query = query.where(x);
        } else {
          query = query.andWhere(x);
        }
      });

      const [contectUs, count] = await query
        .andWhere("contect_us.is_deleted = :deleted", {
          deleted: false,
        })
        .orderBy("contect_us.created_at", "DESC")
        .skip(req.query.per_page * (req.query.page_number - 1))
        .take(req.query.per_page)
        .getManyAndCount();

      const AllCount = await contectUsRepo
        .createQueryBuilder("contect_us")
        .andWhere("contect_us.is_deleted = :deleted", {
          deleted: false,
        })
        .getCount();

      let ItemArray = [];

      for await (const contectus of contectUs) {
        ItemArray.push({
          id: contectus.id,
          first_name: contectus.first_name,
          email: contectus.email,
          phone_no: contectus.phone_no,
          website: contectus.website,
          message: contectus.message,
          is_mail: contectus.email != "" ? true : false,
        })
      }

      const result = {
        contectUs: ItemArray,
        count: count,
        AllCount: AllCount,
      };
      if (result) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(result, "Contect Us get successfully.", httpStatus.OK)
          );
      }
    } catch (err) {
      console.log(err)
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            err,
            "Error in getting Contect Us",
            httpStatus.INTERNAL_SERVER_ERROR
          )
        );
    }
  },
};


const addSetting = {
  validator: celebrate({
    body: Joi.object().keys({
      setting: Joi.array().items(
        Joi.object({
          form_name: Joi.string().required(),
          is_active: Joi.boolean()
            .required()
        })
      ),
      username: Joi.string().required(),
      password: Joi.string().required(),
      discription: Joi.string().required(),
      key_point: Joi.string().required(),
      let_s_talk: Joi.string().required(),
    })
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const settingRepo = getRepository(Setting);
      const emailSettingRepo = getRepository(EmailSetting);
      const careerSettingRepo = getRepository(CareerSetting);


      let deleteFunction = [settingRepo
        .createQueryBuilder("setting")
        .delete()
        .execute()]

      await Promise.all(deleteFunction);

      let functions = [];

      functions.push(req.body.setting.map((x: any) => {

        let newSetting = {
          form_name: x.form_name,
          is_active: x.is_active
        }
        const setting = settingRepo.create(newSetting);
        return settingRepo.save(setting);

      }))

      await Promise.all(functions);


      if (req.body.username != " " && req.body.password != "") {


        emailSettingRepo
          .createQueryBuilder("email_setting")
          .delete()
          .execute()

        let newEmailSetting = {
          username: req.body.username,
          password: req.body.password
        }

        const emailSetting = emailSettingRepo.create(newEmailSetting);
        await emailSettingRepo.save(emailSetting);

      }

      if (req.body.discription != " " && req.body.key_point != "" && req.body.let_s_talk != "") {


        careerSettingRepo
          .createQueryBuilder("career_setting")
          .delete()
          .execute()

        let newCareerSetting = {
          discription: req.body.discription,
          key_point: req.body.key_point,
          let_s_talk: req.body.let_s_talk,
        }

        const careerSetting = careerSettingRepo.create(newCareerSetting);
        await careerSettingRepo.save(careerSetting);

      }


      return res
        .status(httpStatus.OK)
        .json(new APIResponse({}, "Setting added Succesfully", 200));

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

const getSettingByID = {

  controller: async (req: any, res: Response): Promise<Response> => {

    try {
      const settingRepo = getRepository(Setting);
      const emailSettingRepo = getRepository(EmailSetting);
      const careerSettingRepo = getRepository(CareerSetting);

      const setting = await settingRepo.find();
      const emailSetting = await emailSettingRepo.findOne();
      // if (emailSetting == null || emailSetting == undefined) {
      //   return res
      //     .status(httpStatus.OK)
      //     .json(
      //       new APIResponse({}, "Setting get successfully.", httpStatus.OK)
      //     );
      // }
      const careerSetting = await careerSettingRepo.findOne();
      // if (careerSetting == null || careerSetting == undefined) {
      //   return res
      //     .status(httpStatus.OK)
      //     .json(
      //       new APIResponse({}, "Setting get successfully.", httpStatus.OK)
      //     );
      // }
      const result = {
        setting: setting == null ? [] : setting.map(x => {
          return {
            form_name: x.form_name,
            is_active: x.is_active
          }
        }),
        username: emailSetting == null ? "" : emailSetting.username,
        password: emailSetting == null ? "" : emailSetting.password,
        discription: careerSetting == null ? "" : careerSetting.discription,
        key_point: careerSetting == null ? "" : careerSetting.key_point.split(','),
        let_s_talk: careerSetting == null ? "" : careerSetting.let_s_talk
      };
      if (result) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(result, "Setting get successfully.", httpStatus.OK)
          );
      }
    } catch (err) {
      console.log(err)
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            err,
            "Error in getting Setting",
            httpStatus.INTERNAL_SERVER_ERROR
          )
        );
    }
  },
};

const getMenuSetting = {

  controller: async (req: any, res: Response): Promise<Response> => {

    try {
      const settingRepo = getRepository(Setting);

      const setting = await settingRepo.find();

      const result = {
        setting: setting.map(x => {
          return {
            form_name: x.form_name,
            is_active: x.is_active
          }
        })
      };
      if (result) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(result, "Menu Setting get successfully.", httpStatus.OK)
          );
      }
    } catch (err) {
      console.log(err)
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            err,
            "Error in getting Menu Setting",
            httpStatus.INTERNAL_SERVER_ERROR
          )
        );
    }
  },
};

const getCareerSetting = {

  controller: async (req: any, res: Response): Promise<Response> => {

    try {
      const careerSettingRepo = getRepository(CareerSetting);

      const careerSetting = await careerSettingRepo.findOne();

      const result = {
        discription: careerSetting.discription,
        key_point: careerSetting.key_point.split(','),
        let_s_talk: careerSetting.let_s_talk
      };
      if (result) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(result, "Career Setting get successfully.", httpStatus.OK)
          );
      }
    } catch (err) {
      console.log(err)
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            err,
            "Error in getting Career Setting",
            httpStatus.INTERNAL_SERVER_ERROR
          )
        );
    }
  },
};


export {
  fileAndImageUpload,
  addContectUs,
  getFilteredContectUs,
  addSetting,
  getSettingByID,
  getMenuSetting,
  getCareerSetting
};