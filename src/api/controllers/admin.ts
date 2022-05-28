import { celebrate } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import Joi from "joi";
import { getRepository } from "typeorm";
import APIResponse from "../../utils/APIResponse";
import { RoleType } from "../../utils/constant";
import { getJWTToken } from "../../utils/jwt.helper";
import {
    User,
} from "../entity";
import { comparePassword, hashPassword } from "../../utils/bcrypt.helper";
import moment from "moment";



const checkLogin = {
    validator: celebrate({
        body: Joi.object().keys({
            email: Joi.string().required()
        }),
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const adminRepo = getRepository(User);

            // Email checking
            const admin = await adminRepo.findOne({
                where: { email: req.body.email, is_deleted: false },
            });

            if (admin) {

                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(
                            { is_login_first: admin.is_login_first, role_type: admin.role_type },
                            "Check Login",
                            httpStatus.OK,
                            "Check Login"
                        )
                    );
            }
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        {},
                        "Wrong Email",
                        httpStatus.BAD_REQUEST,
                        "Wrong Email"
                    )
                );
        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        {},
                        "Wrong Email",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    },
};


const setPassword = {
    validator: celebrate({
        body: Joi.object().keys({
            email: Joi.string().required(),
            password: Joi.string().required(),
            role_type: Joi.string().valid(...Object.values(RoleType)).required(),
            is_login_first: Joi.boolean().required()
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const userRepo = getRepository(User);

            const checkUser = await userRepo.findOne({
                where: {
                    email: req.body.email,
                    is_login_first: req.body.is_login_first,
                    is_deleted: false
                },
            });
            if (!checkUser) {
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .json(
                        new APIResponse(
                            null,
                            "User not found",
                            httpStatus.BAD_REQUEST,
                            httpStatus.BAD_REQUEST
                        )
                    );
            }
            if (checkUser) {
                // Password Encryption
                let newPassword = "";
                if (req.body.password) {
                    newPassword = await hashPassword(req.body.password, 16);

                }
                const newUser = {
                    password: newPassword,
                    is_login_first: true
                };

                // Create and add the user into database
                const user = userRepo.merge(checkUser, newUser);
                let result = await userRepo.save(user);
                result = JSON.parse(JSON.stringify(result));

                if (result) {

                    const token = getJWTToken({
                        id: result.id,
                        email: req.body.email,
                        role: req.body.role_type,
                    });

                    const newResult = {
                        id: result.id,
                        last_name: result.last_name,
                        first_name: result.first_name,
                        email: result.email,
                        token
                    };
                    return res
                        .status(httpStatus.OK)
                        .json(new APIResponse(newResult, "Passsword Set Succesfully", 200));
                }
                // Encrypted password add into user detail

                throw new Error("Password Not Set");
            }
            throw new Error("User already exists");
        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        {},
                        "User already exists",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    },
};


const login = {
    validator: celebrate({
        body: Joi.object().keys({
            email: Joi.string().required(),
            password: Joi.string().required(),
            role_type: Joi.string().valid(...Object.values(RoleType)).required(),
            is_login_first: Joi.boolean().required()
        }),
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const adminRepo = getRepository(User);

            // Email checking
            const admin = await adminRepo.findOne({
                where: { email: req.body.email, role_type: req.body.role_type, is_login_first: true, is_deleted: false },
            });

            if (admin) {

                const passwordMatch = await comparePassword(req.body.password, admin.password);
                if (passwordMatch) {

                    const token = getJWTToken({
                        id: admin.id,
                        email: req.body.email,
                        role: req.body.role_type,
                    });

                    const newUser = {
                        id: admin.id,
                        email: req.body.email,
                        role: req.body.role_type,
                        token,
                    };

                    return res
                        .status(httpStatus.OK)
                        .json(
                            new APIResponse(
                                newUser,
                                "Login Successfully",
                                200,
                                httpStatus[200]
                            )
                        );
                }
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .json(
                        new APIResponse(
                            null,
                            "Wrong Password",
                            httpStatus.BAD_REQUEST,
                            "Wrong Password"
                        )
                    );
            }
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        null,
                        "Wrong Password",
                        httpStatus.BAD_REQUEST,
                        "Wrong Password"
                    )
                );
            // throw new Error("There is no corresponding member information.");
        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        null,
                        "Incorrect Password",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    },
};

const validateAdmin = {
    controller: async (req: any, res: Response) => {
        return res
            .status(httpStatus.OK)
            .json(new APIResponse(null, "Admin Verified", httpStatus.OK));
    },
};

const addUser = {
    validator: celebrate({
        body: Joi.object().keys({
            last_name: Joi.string().required(),
            first_name: Joi.string().required(),
            email: Joi.string().required(),
            role_type: Joi.string().valid(...Object.values(RoleType)).required()
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const userRepo = getRepository(User);

            const checkUser = await userRepo.findOne({
                where: {
                    email: req.body.email,
                    is_deleted: false,
                },
            });
            if (!checkUser) {

                const newUser = {
                    last_name: req.body.last_name,
                    first_name: req.body.first_name,
                    email: req.body.email,
                    role_type: req.body.role_type,
                    is_deleted: false,
                    is_login_first: false
                };

                const user = userRepo.create(newUser);
                let result = await userRepo.save(user);
                result = JSON.parse(JSON.stringify(result));

                if (result) {
                    return res
                        .status(httpStatus.OK)
                        .json(new APIResponse({}, "User added Succesfully", 200));
                }

                throw new Error("User Not Added");
            }
            throw new Error("User already exists");
        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        {},
                        "User already exists",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    },
};

const editUser = {
    validator: celebrate({
        params: Joi.object().keys({
            id: Joi.string().required(),
        }),
        body: Joi.object().keys({
            last_name: Joi.string().required(),
            first_name: Joi.string().required(),
            email: Joi.string().required(),
            role_type: Joi.string().required(),
            password_chnage: Joi.boolean().required()
        }),
    }),

    controller: async (req: any, res: Response): Promise<Response> => {
        try {
            const userRepo = getRepository(User);

            const checkUser = await userRepo.findOne({ where: { id: req.params.id, is_deleted: false } });

            if (!checkUser) {
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .json(
                        new APIResponse(
                            null,
                            "User not found",
                            httpStatus.BAD_REQUEST,
                            httpStatus.BAD_REQUEST
                        )
                    );
            }

            let data = {}

            if (req.body.password_chnage) {
                data = {
                    last_name: req.body.last_name,
                    first_name: req.body.first_name,
                    email: req.body.email,
                    is_login_first: false,
                    role_type: req.body.role_type
                };
            } else {
                data = {
                    last_name: req.body.last_name,
                    first_name: req.body.first_name,
                    email: req.body.email,
                    role_type: req.body.role_type
                };
            }
            userRepo.merge(checkUser, data);
            const result = await userRepo.save(checkUser);

            if (result) {

                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse(null, "User edit successfully", httpStatus.OK));
            }

            throw new Error("User not Exists");
        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        null,
                        "Error in user edit",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    },
};

const deleteUserByAdmin = {
    validator: celebrate({
        body: Joi.object().keys({
            id: Joi.string().required(),
        })
    }),

    controller: async (req: any, res: Response): Promise<Response> => {
        try {
            const userRepo = getRepository(User);

            const results = await userRepo
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
                    .json(new APIResponse(null, "User Deleted", httpStatus.OK));
            }
            throw new Error("User not Exists");
        } catch (error) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json(
                    new APIResponse(
                        null,
                        "User not Exists",
                        httpStatus.BAD_REQUEST,
                        error
                    )
                );
        }
    },
};

const getUsers = {
    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const userRepo = getRepository(User);

            const users = await userRepo.find({ where: { is_deleted: false } });

            if (users) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(users, "Users get successfully.", httpStatus.OK)
                    );
            }

            throw new Error("Users not found.");
        } catch (error) {
            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get Users.",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};

const userById = {
    validator: celebrate({
        params: Joi.object().keys({
            id: Joi.string().required(),
        }),
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const userRepo = getRepository(User);

            const user = await userRepo
                .createQueryBuilder("user")
                .select(["user"])
                .where(`user.id = '${req.params.id}'`)
                .andWhere("user.is_deleted = :is_deleted", {
                    is_deleted: false,
                })
                .getOne();

            if (user) {
                let newUser;
                newUser = {
                    id: user.id,
                    last_name: user.last_name ?? "",
                    email: user.email ?? "",
                    first_name: user.first_name ?? "",
                    role_type: user.role_type
                };
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(newUser, "Users get successfully.", httpStatus.OK)
                    );
            }

            throw new Error("Users not found.");
        } catch (error) {
            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get Users.",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};

const getFilteredUsers = {
    validator: celebrate({
        query: Joi.object().keys({
            date_option: Joi.string().default("created_at"),
            start_date: Joi.string().allow(null, ""),
            end_date: Joi.string().allow(null, ""),
            search_term: Joi.string().allow(null, ""),
            per_page: Joi.number().required(),
            page_number: Joi.number().required()
        }),
    }),


    controller: async (req: any, res: Response): Promise<Response> => {

        try {
            const userRepo = getRepository(User);

            let conditions = [];

            Object.keys(req.query).map((query) => {
                switch (query) {
                    case "date_option":
                        if (!req.query.start_date) break;
                        if (!req.query.end_date) break;
                        const start_date = `${req.query.start_date} 00:00:00.000000`;
                        const end_date = `${moment(req.query.end_date)
                            .add(1, "days")
                            .format()
                            .slice(0, 10)} 00:00:00.000000`;
                        conditions.push(
                            `user.${req.query.date_option} BETWEEN '${start_date}' AND '${end_date}'`
                        );
                        break;
                    case "search_term":
                        if (!req.query.search_term) break;
                        req.query.search_term.split(" ").map((x: string) => {
                            conditions.push(
                                `(user.first_name ILIKE '%${x}%' OR user.last_name ILIKE '%${x}%' OR user.email ILIKE '%${x}%')`
                            );
                        });
                        break;
                }
            });

            let query;

            query = userRepo
                .createQueryBuilder("user")
                .select(["user"])

            conditions.map((x, i) => {
                if (!i) {
                    query = query.where(x);
                } else {
                    query = query.andWhere(x);
                }
            });


            const [users, count] = await query
                .andWhere("user.is_deleted = :deleted", {
                    deleted: false,
                })
                .andWhere("user.role_type != :role_type", {
                    role_type: RoleType.admin,
                })
                .orderBy("user.created_at", "DESC")
                .skip(req.query.per_page * (req.query.page_number - 1))
                .take(req.query.per_page)
                .getManyAndCount();

            const AllCount = await userRepo
                .createQueryBuilder("user")
                .andWhere("user.is_deleted = :deleted", {
                    deleted: false,
                })
                .andWhere("user.role_type != :role_type", {
                    role_type: RoleType.admin,
                })
                .getCount();

            const result = {
                users: users.map((x) => {
                    return {
                        id: x.id,
                        first_name: x.first_name,
                        last_name: x.last_name,
                        email: x.email,
                        role_type: x.role_type,
                        created_at: moment(x.created_at).format("YYYY.MM.DD"),
                    };
                }),
                count: count,
                AllCount: AllCount,
            };
            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(result, "Users get successfully.", httpStatus.OK)
                    );
            }
        } catch (err) {

            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json(
                    new APIResponse(
                        err,
                        "Error in getting user",
                        httpStatus.INTERNAL_SERVER_ERROR
                    )
                );
        }
    },
};


export {
    checkLogin,
    setPassword,
    login,
    addUser,
    editUser,
    validateAdmin,
    deleteUserByAdmin,
    getUsers,
    userById,
    getFilteredUsers
};
