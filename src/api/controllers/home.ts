import { celebrate } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import Joi, { x } from "joi";
import { getRepository } from "typeorm";
import APIResponse from "../../utils/APIResponse";
import { HeroSection, WhyChooseSection, AboutSection, HomePortfolio } from "../entity";
import CounterSection from '../entity/counterSection';
import SpecialitySection from '../entity/ourSpeciality';
import HowWorkSection from '../entity/howWorkSection';
import FooterSection from '../entity/footerSection';
import Portfolio from '../entity/portfolio';
import Category from '../entity/category';

function isEmptyData(section: any) {
    if (section == undefined) {
        return true
    }
    return false
}

const addHeroSection = {
    validator: celebrate({
        body: Joi.object().keys({
            title: Joi.string().required(),
            details: Joi.string().required(),
            image: Joi.string().required()
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const heroSectionRepo = getRepository(HeroSection);
            const results = await heroSectionRepo
                .createQueryBuilder("hero_section")
                .delete()
                .execute();

            const newHeroSection = {
                title: req.body.title,
                details: req.body.details,
                image: req.body.image,
                is_deleted: false
            };

            const heroSection = heroSectionRepo.create(newHeroSection);
            let result = await heroSectionRepo.save(heroSection);
            result = JSON.parse(JSON.stringify(result));

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "Hero Section added Succesfully", 200));
            }

            throw new Error("Hero Section Not Added");
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

// const editHeroSection = {
//     params: Joi.object().keys({
//         id: Joi.string().required(),
//     }),
//     validator: celebrate({
//         body: Joi.object().keys({
//             title: Joi.string().required(),
//             details: Joi.string().required(),
//             image: Joi.string().required()
//         })
//     }),

//     controller: async (req: Request, res: Response): Promise<Response> => {
//         try {
//             const heroSectionRepo = getRepository(HeroSection);

//             const checkHeroSection = await heroSectionRepo.findOne({ where: { id: req.params.id, is_deleted: false } });

//             if (!checkHeroSection) {
//                 return res
//                     .status(httpStatus.BAD_REQUEST)
//                     .json(
//                         new APIResponse(
//                             null,
//                             "Blog not found",
//                             httpStatus.BAD_REQUEST,
//                             httpStatus.BAD_REQUEST
//                         )
//                     );
//             }

//             const newHeroSection = {
//                 title: req.body.title,
//                 details: req.body.details,
//                 image: req.body.image,
//                 is_deleted: false
//             };

//             heroSectionRepo.merge(checkHeroSection, newHeroSection);
//             const result = await heroSectionRepo.save(checkHeroSection);

//             if (result) {
//                 return res
//                     .status(httpStatus.OK)
//                     .json(new APIResponse({}, "Hero Section edit Succesfully", 200));
//             }

//             throw new Error("Hero Section Not Added");
//         } catch (error) {
//             return res
//                 .status(httpStatus.BAD_REQUEST)
//                 .json(
//                     new APIResponse(
//                         {},
//                         "Somthing went wrong",
//                         httpStatus.BAD_REQUEST,
//                         error
//                     )
//                 );
//         }
//     },
// };

const getHeroSection = {
    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const heroSectionRepo = getRepository(HeroSection);

            const heroSection = await heroSectionRepo.findOne({ where: { is_deleted: false } });

            let result;

            if (!isEmptyData(heroSection)) {
                result = {
                    id: heroSection.id,
                    title: heroSection.title,
                    details: heroSection.details,
                    image: {
                        displayImage: heroSection.image ? `${process.env.Image_Url}` + heroSection.image : "",
                        image: heroSection.image ? heroSection.image : ""
                    }
                }
            } else {
                result = {}
            }

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(result, "Hero Section get successfully", httpStatus.OK)
                    );
            }

        } catch (error) {
            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get Hero Section",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};

// const deleteHeroSection = {
//     validator: celebrate({
//         params: Joi.object().keys({
//             id: Joi.string().required(),
//         })
//     }),

//     controller: async (req: any, res: Response): Promise<Response> => {
//         try {
//             const heroSectionRepo = getRepository(HeroSection);

//             const results = await heroSectionRepo
//                 .createQueryBuilder()
//                 .update({
//                     is_deleted: true,
//                     deleted_at: new Date().toUTCString()
//                 })
//                 .where("id = :ids", { ids: req.params.id })
//                 .execute();

//             if (results) {
//                 return res
//                     .status(httpStatus.OK)
//                     .json(new APIResponse(null, "Hero Section Deleted", httpStatus.OK));
//             }
//             throw new Error("Hero Section not Exists");
//         } catch (error) {
//             return res
//                 .status(httpStatus.BAD_REQUEST)
//                 .json(
//                     new APIResponse(
//                         null,
//                         "Hero Section not Exists",
//                         httpStatus.BAD_REQUEST,
//                         error
//                     )
//                 );
//         }
//     },
// };



const addWhyChooseSection = {
    validator: celebrate({
        body: {
            main_title: Joi.string().required(),
            section: Joi.array().items(Joi.object().keys({
                title: Joi.string().required(),
                description: Joi.string().required(),
                image: Joi.string().required()
            }))
        }
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            console.log(req.body);

            const whyChooseRepo = getRepository(WhyChooseSection);
            // let newData = req.body.section;

            const results = await whyChooseRepo
                .createQueryBuilder("why_choose")
                .delete()
                .execute();


            const newSpecialitySection = {
                main_title: req.body.main_title,
                section: JSON.stringify(req.body.section),
            };

            const whyChooseSection = whyChooseRepo.create(newSpecialitySection);
            let result = await whyChooseRepo.save(whyChooseSection);
            result = JSON.parse(JSON.stringify(result));

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "why Choose Section added Succesfully", 200));
            }

            // let data;

            // newData.forEach(element => {
            //     let whyChooseSection = whyChooseRepo.create(element);
            //     let result = whyChooseRepo.save(whyChooseSection);
            //     data = JSON.parse(JSON.stringify(result));
            // });

            // if (data) {
            //     return res
            //         .status(httpStatus.OK)
            //         .json(new APIResponse({}, "why Choose Section added Succesfully", 200));
            // }

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


const getWhyChooseSection = {
    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const whyChooseRepo = getRepository(WhyChooseSection);
            const whyChooseSection = await whyChooseRepo.findOne();
            let finalResult = {};

            if (whyChooseSection == null || whyChooseSection == undefined) {
                finalResult = {}
            } else {
                let result = {
                    id: whyChooseSection.id,
                    main_title: whyChooseSection.main_title,
                    section: JSON.parse(whyChooseSection.section),
                }
                let newSpecialityResult = result.section.map((x) => {
                    return {
                        title: x.title,
                        displayImage: x.image ? `${process.env.Image_Url}` + x.image : "",
                        image: x.image ? x.image : "",
                        description: x.description,
                    }
                })
                finalResult = {
                    ...result,
                    section: newSpecialityResult
                }
            }
            if (finalResult) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(finalResult, "speciality section get successfully", httpStatus.OK)
                    );
            }

            // let result = whyChooseSection.map((x) => {
            //     return {
            //         id: x.id,
            //         main_title: x.main_title,
            //         description: x.description,
            //         title: x.title,
            //         image: {
            //             displayImage: x.image ? `${process.env.Image_Url}` + x.image : "",
            //             image: x.image ? x.image : ""
            //         }
            //     }
            // })
            // if (result) {
            //     return res
            //         .status(httpStatus.OK)
            //         .json(
            //             new APIResponse(result, "why Choose get successfully", httpStatus.OK)
            //         );
            // }

        } catch (error) {
            console.log(error);

            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get why Choose Section",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};

const addaboutUsSection = {
    validator: celebrate({
        body: Joi.object().keys({
            main_title: Joi.string().required(),
            title: Joi.string().required(),
            description: Joi.string().required(),
            image: Joi.string().required().allow(''),
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const aboutRepo = getRepository(AboutSection);

            const results = await aboutRepo
                .createQueryBuilder("about_us")
                .delete()
                .execute();

            const newAbout = {
                main_title: req.body.main_title,
                title: req.body.title,
                description: req.body.description,
                image: req.body.image
            };


            const aboutInstance = aboutRepo.create(newAbout);
            let result = await aboutRepo.save(aboutInstance);
            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "about us Section added Succesfully", 200));
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

const getAboutSection = {
    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const aboutRepo = getRepository(AboutSection);
            const aboutSection = await aboutRepo.findOne({ where: { is_deleted: false } });
            let result = {}
            if (aboutSection == null || aboutSection == undefined) {
                result = {}
            } else {
                result = {
                    id: aboutSection.id,
                    main_title: aboutSection.main_title,
                    description: aboutSection.description,
                    title: aboutSection.title,
                    image: {
                        displayImage: aboutSection.image ? `${process.env.Image_Url}` + aboutSection.image : "",
                        image: aboutSection.image ? aboutSection.image : ""
                    }
                }
            }

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(result, "about Us get successfully", httpStatus.OK)
                    );
            }

        } catch (error) {
            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get about Us Section",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};


const addCounterSection = {
    validator: celebrate({
        body: {
            main_title: Joi.string().required(),
            counterData: Joi.array().items(Joi.object().keys({
                image: Joi.string().required(),
                firstColor: Joi.string().required(),
                secondColor: Joi.string().required(),
                thirdColor: Joi.string().required(),
                number_input: Joi.number().required(),
                symbol: Joi.string().required(),
                title: Joi.string().required(),
            }))
        }
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {

        try {
            console.log(req.body);

            const counterRepo = getRepository(CounterSection);

            const results = await counterRepo
                .createQueryBuilder("counter_section")
                .delete()
                .execute();

            const newSpecialitySection = {
                main_title: req.body.main_title,
                counterData: JSON.stringify(req.body.counterData),
            };

            const counterSection = counterRepo.create(newSpecialitySection);
            let data = await counterRepo.save(counterSection);
            data = JSON.parse(JSON.stringify(data));

            // let data = [];

            // data.push(req.body.counterData.map((x: any) => {
            //     return counterRepo.save(counterRepo.create(x))
            // }))

            // await Promise.all(data);

            if (data) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "counter Section added Succesfully", 200));
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

const getConterSection = {
    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const counterRepo = getRepository(CounterSection);
            const counterSection = await counterRepo.findOne();
            let finalResult = {};

            if (counterSection == null || counterSection == undefined) {
                finalResult = {}
            } else {
                let result = {
                    id: counterSection.id,
                    main_title: counterSection.main_title,
                    counterData: JSON.parse(counterSection.counterData),
                }


                let newSpecialityResult = result.counterData.map((x) => {
                    return {
                        id: x.id,
                        image: {
                            displayImage: x.image ? `${process.env.Image_Url}` + x.image : "",
                            image: x.image ? x.image : ""
                        },
                        firstColor: x.firstColor,
                        secondColor: x.secondColor,
                        thirdColor: x.thirdColor,
                        number_input: x.number_input,
                        title: x.title,
                        symbol: x.symbol
                    }
                })
                finalResult = {
                    ...result,
                    counterData: newSpecialityResult
                }
            }
            if (finalResult) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(finalResult, "counter section get successfully", httpStatus.OK)
                    );
            } else {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse([], "counter section Not Found", httpStatus.OK)
                    );
            }

        } catch (error) {
            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get counter section Section",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};

const addSpecialitySection = {
    validator: celebrate({
        body: Joi.object().keys({
            main_title: Joi.string().required(),
            details: Joi.string().required(),
            left_menu: Joi.array().items(Joi.object().keys({
                image: Joi.string().required(),
                title: Joi.string().required(),
                color: Joi.string().required(),
                gradientColor: Joi.string().required(),
            })),
            right_menu: Joi.array().items(Joi.object().keys({
                statistics: Joi.string().required(),
                percentage: Joi.number().required(),
                color: Joi.string().required(),
            }))
        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {

        try {
            const specialityRepo = getRepository(SpecialitySection);

            const results = await specialityRepo
                .createQueryBuilder("our_speciality")
                .delete()
                .execute();

            const newSpecialitySection = {
                main_title: req.body.main_title,
                details: req.body.details,
                left_menu: JSON.stringify(req.body.left_menu),
                right_menu: JSON.stringify(req.body.right_menu)
            };

            const specialitySection = specialityRepo.create(newSpecialitySection);
            let result = await specialityRepo.save(specialitySection);
            result = JSON.parse(JSON.stringify(result));

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "Hero Section added Succesfully", 200));
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

const getSpecialitySection = {
    controller: async (req: Request, res: Response): Promise<Response> => {
        try {

            const specialityRepo = getRepository(SpecialitySection);
            const specialitySection = await specialityRepo.findOne();
            let finalResult = {};
            if (specialitySection == null || specialitySection == undefined) {
                finalResult = {}
            } else {
                let result = {
                    id: specialitySection.id,
                    main_title: specialitySection.main_title,
                    details: specialitySection.details,
                    left_menu: JSON.parse(specialitySection.left_menu),
                    right_menu: JSON.parse(specialitySection.right_menu)
                }

                let newSpecialityResult = result.left_menu.map((x) => {
                    return {
                        title: x.title,
                        displayImage: x.image ? `${process.env.Image_Url}` + x.image : "",
                        image: x.image ? x.image : "",
                        color: x.color,
                        gradientColor: x.gradientColor
                    }
                })

                finalResult = {
                    ...result,
                    left_menu: newSpecialityResult
                }
            }


            if (finalResult) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(finalResult, "speciality section get successfully", httpStatus.OK)
                    );
            }


        } catch (error) {
            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get speciality section Section",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};


const addHowWorkSection = {
    validator: celebrate({
        body: {
            "workSection": Joi.array().items(Joi.object().keys({
                main_title: Joi.string().required(),
                title: Joi.string().required(),
                image: Joi.string().required(),
                details: Joi.string().required(),
            }))
        }
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {

        try {
            const workRepo = getRepository(HowWorkSection);

            const results = await workRepo
                .createQueryBuilder("how_we_section")
                .delete()
                .execute();

            let data = [];

            data.push(req.body.workSection.map((x: any) => {
                return workRepo.save(workRepo.create(x))
            }))

            await Promise.all(data);

            if (data) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "how work Section added Succesfully", 200));
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


const getHowWorkSection = {
    controller: async (req: Request, res: Response): Promise<Response> => {
        try {

            const workRepo = getRepository(HowWorkSection);
            const workSection = await workRepo.find();
            let result = workSection.map((x) => {
                return {
                    id: x.id,
                    details: x.details,
                    title: x.title,
                    image: {
                        displayImage: x.image ? `${process.env.Image_Url}` + x.image : "",
                        image: x.image ? x.image : ""
                    }
                }
            })


            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(result, "how work section get successfully", httpStatus.OK)
                    );
            }


        } catch (error) {
            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get how work section",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};




const addFooterSection = {
    validator: celebrate({
        body: Joi.object().keys({
            description: Joi.string().required(),
            socialIcon: Joi.object().keys({
                facebook: Joi.string().required(),
                instagram: Joi.string().required(),
                twitter: Joi.string().required(),
                linkedIn: Joi.string().required()
            }),
            contactInfo: Joi.object().keys({
                location: Joi.string().required(),
                contact_no: Joi.string().required(),
                email: Joi.string().required(),
                opening_time: Joi.string().required()
            }),
            copyRight: Joi.string().required()

        })
    }),

    controller: async (req: Request, res: Response): Promise<Response> => {

        try {
            const footerRepo = getRepository(FooterSection);

            const results = await footerRepo
                .createQueryBuilder("footer_section")
                .delete()
                .execute();

            let jsonsocialIcon = JSON.stringify(req.body.socialIcon);
            let jsoncontactInfo = JSON.stringify(req.body.contactInfo);

            const newSocialIconSection = {
                description: req.body.description,
                socialIcon: jsonsocialIcon,
                contactInfo: jsoncontactInfo,
                copyRight: req.body.copyRight
            };

            const footerSection = footerRepo.create(newSocialIconSection);
            let result = await footerRepo.save(footerSection);
            result = JSON.parse(JSON.stringify(result));

            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(new APIResponse({}, "footer Section added Succesfully", 200));
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

const getFooterSection = {
    controller: async (req: Request, res: Response): Promise<Response> => {
        try {

            const footerRepo = getRepository(FooterSection);
            const footerSection = await footerRepo.findOne({});
            let result = {}
            if (footerSection == null || footerSection == undefined) {
                result = {}
            } else {
                result = {
                    id: footerSection.id,
                    description: footerSection.description,
                    socialIcon: JSON.parse(footerSection.socialIcon),
                    contactInfo: JSON.parse(footerSection.contactInfo),
                    copyRight: footerSection.copyRight
                }
            }
            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(result, "footer section get successfully", httpStatus.OK)
                    );
            }


        } catch (error) {
            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get footer section",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};

function isEmpty(section: any) {
    if (section == undefined) {
        return true
    }
    return false
}


const getAllHomeSection = {
    controller: async (req: Request, res: Response): Promise<Response> => {
        try {
            const heroSectionRepo = getRepository(HeroSection);
            const heroSection = await heroSectionRepo.findOne();

            let newHeroSection;

            if (!isEmpty(heroSection)) {
                newHeroSection = {
                    id: heroSection.id,
                    title: heroSection.title,
                    details: heroSection.details,
                    image: heroSection.image ? `${process.env.Image_Url}` + heroSection.image : ""
                }

            } else {
                newHeroSection = {}
            }


            const whyChooseRepo = getRepository(WhyChooseSection);
            // const whyChooseSection = await whyChooseRepo.findOne();
            // let newWhyChooseSection;

            // if (!isEmpty(whyChooseSection)) {
            //     newWhyChooseSection = whyChooseSection.map((x) => {
            //         return {
            //             title: x.title,
            //             displayImage: x.image ? `${process.env.Image_Url}` + x.image : "",
            //             image: x.image ? x.image : "",
            //             description: x.description,
            //         }
            //     })

            // } else {
            //     newWhyChooseSection = []
            // }
            const whyChooseSection = await whyChooseRepo.findOne();
            let newWhyChooseSection;
            if (!isEmpty(whyChooseSection)) {
                let newResult = {
                    id: whyChooseSection.id,
                    main_title: whyChooseSection.main_title,
                    section: JSON.parse(whyChooseSection.section),
                }

                let newWhyChooseSectionresult = newResult.section.map((x) => {
                    return {
                        title: x.title,
                        image: x.image ? `${process.env.Image_Url}` + x.image : "",
                        description: x.description,
                    }
                })
                newWhyChooseSection = {
                    ...newResult,
                    section: newWhyChooseSectionresult
                }
            } else {
                newWhyChooseSection = {}
            }


            const aboutRepo = getRepository(AboutSection);
            const aboutSection = await aboutRepo.findOne();
            let newAboutSection
            if (!isEmpty(aboutSection)) {
                newAboutSection = {
                    id: aboutSection.id,
                    main_title: aboutSection.main_title,
                    description: aboutSection.description,
                    title: aboutSection.title,
                    image: aboutSection.image ? `${process.env.Image_Url}` + aboutSection.image : ""
                }

            } else {
                newAboutSection = {}
            }

            const counterRepo = getRepository(CounterSection);
            const counterSection = await counterRepo.findOne();
            let newCounterSection;

            if (!isEmpty(counterSection)) {
                let newResult = {
                    id: counterSection.id,
                    main_title: counterSection.main_title,
                    counterData: JSON.parse(counterSection.counterData),
                }

                let newCounterSectionresult = newResult.counterData.map((x) => {
                    return {
                        id: x.id,
                        image: x.image ? `${process.env.Image_Url}` + x.image : "",
                        firstColor: x.firstColor,
                        secondColor: x.secondColor,
                        thirdColor: x.thirdColor,
                        number_input: x.number_input,
                        title: x.title,
                        symbol: x.symbol
                    }
                })
                newWhyChooseSection = {
                    ...newResult,
                    section: newCounterSectionresult
                }
                // newCounterSection = counterSection.map((x) => {
                //     return {
                // id: x.id,
                // image: x.image ? `${process.env.Image_Url}` + x.image : "",
                // firstColor: x.firstColor,
                // secondColor: x.secondColor,
                // thirdColor: x.thirdColor,
                // number_input: x.number_input,
                // title: x.title,
                // symbol: x.symbol
                //     }
                // })
            } else {
                newCounterSection = []
            }

            const specialityRepo = getRepository(SpecialitySection);
            const specialitySection = await specialityRepo.findOne();
            let finalResult;
            if (!isEmpty(specialitySection)) {
                let newResult = {
                    id: specialitySection.id,
                    main_title: specialitySection.main_title,
                    details: specialitySection.details,
                    left_menu: JSON.parse(specialitySection.left_menu),
                    right_menu: JSON.parse(specialitySection.right_menu)
                }

                let newSpecialityResult = newResult.left_menu.map((x) => {
                    return {
                        title: x.title,
                        image: x.image ? `${process.env.Image_Url}` + x.image : "",
                        color: x.color,
                        gradientColor: x.gradientColor
                    }
                })
                finalResult = {
                    ...newResult,
                    left_menu: newSpecialityResult
                }
            } else {
                finalResult = {}
            }

            const workRepo = getRepository(HowWorkSection);
            const workSection = await workRepo.find();
            let newworkSection;
            if (!isEmpty(workSection)) {
                newworkSection = workSection.map((x) => {
                    return {
                        id: x.id,
                        details: x.details,
                        title: x.title,
                        image: x.image ? `${process.env.Image_Url}` + x.image : ""
                    }
                })
            } else {
                newworkSection = []
            }

            const footerRepo = getRepository(FooterSection);
            const footerSection = await footerRepo.findOne();
            let newfooterSection;
            if (!isEmpty(footerSection)) {
                newfooterSection = {
                    id: footerSection.id,
                    description: footerSection.description,
                    socialIcon: JSON.parse(footerSection.socialIcon),
                    contactInfo: JSON.parse(footerSection.contactInfo),
                    copyRight: footerSection.copyRight
                }
            } else {
                newfooterSection = {}
            }

            const hoemPortfolioSectionRepo = getRepository(HomePortfolio);
            const homePortfolio = await hoemPortfolioSectionRepo.findOne();

            let newPortfolioSection = {
                title: homePortfolio == undefined ? "" : homePortfolio.title,
                description: homePortfolio == undefined ? "" : homePortfolio.description,
            }

            let result = {
                heroSection: newHeroSection,
                whyChooseSection: newWhyChooseSection,
                aboutSection: newAboutSection,
                counterSection: newCounterSection,
                specialitySection: finalResult,
                workSection: newworkSection,
                footerSection: newfooterSection,
                portfolioSection: newPortfolioSection
            }
            if (result) {
                return res
                    .status(httpStatus.OK)
                    .json(
                        new APIResponse(result, "Home section get successfully", httpStatus.OK)
                    );
            }
        } catch (error) {

            return res
                .status(404)
                .json(
                    new APIResponse(
                        null,
                        "Cannot get Home section",
                        httpStatus.NOT_FOUND,
                        error
                    )
                );
        }
    },
};

export {
    addHeroSection,
    // editHeroSection,
    getHeroSection,
    // deleteHeroSection,
    addWhyChooseSection,
    getWhyChooseSection,
    addaboutUsSection,
    getAboutSection,
    addCounterSection,
    getConterSection,
    addSpecialitySection,
    getSpecialitySection,
    addHowWorkSection,
    getHowWorkSection,
    addFooterSection,
    getFooterSection,
    getAllHomeSection

}