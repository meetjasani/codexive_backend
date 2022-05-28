import express from "express";
import { addaboutUsSection, addCounterSection, addFooterSection, addHeroSection, addHowWorkSection, addSpecialitySection, addWhyChooseSection, getAboutSection, getAllHomeSection, getConterSection, getFooterSection, getHeroSection, getHowWorkSection, getSpecialitySection, getWhyChooseSection } from "../controllers/home";
const router = express.Router();
/**
 * @swagger
 * /home/add-hero-section:
 *  post:
 *    tags: [Home]
 *    description: Add Hero Section
 *    security:
 *    - Token: []
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          title:
 *            type: string
 *          details:
 *            type: string
 *          image:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */
router.post("/add-hero-section", addHeroSection.validator, addHeroSection.controller);


// /**
// * @swagger
// * /home/edit-hero-section/{id}:
// *  put:
// *    tags: [Home]
// *    description: Edit Hero Section
// *    security:
// *    - Token: []
// *    parameters:
// *    - in: path
// *      name: id
// *      type: string
// *      required: true
// *    - in: body
// *      name: body
// *      required: true
// *      schema:
// *        type: object
// *        properties:
// *          title:
// *            type: string
// *          details:
// *            type: string
// *          image:
// *            type: string
// *    responses:
// *      200:
// *        description: Success
// *        content: {}
// *
// */
// router.put(
//     "/edit-hero-section/:id",
//     editHeroSection.validator,
//     editHeroSection.controller
// );


/**
 * @swagger
 * /home/get-hero-section:
 *  get:
 *    tags: [Home]
 *    description: Get Hero Section
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */
router.get("/get-hero-section", getHeroSection.controller);

// /**
//  * @swagger
//  * /home/delete-hero-section/{id}:
//  *  get:
//  *    tags: [Blog]
//  *    description: Delete Hero Section
//  *    security:
//  *    - Token: []
//  *    parameters:
//  *    - in: path
//  *      name: id
//  *      required: true
//  *    responses:
//  *      200:
//  *        description: Success
//  *        content: {}
//  *
//  */
// router.delete("/delete-hero-section/:id", deleteHeroSection.validator, deleteHeroSection.controller);


/**
 * @swagger
 * /home/add-WhyChoose-section:
 *  post:
 *    tags: [Home]
 *    description: Add WhyChoose Section
 *    security:
 *    - Token: []
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *         section:
 *            type: array
 *            example: [
 *                        {
 *                             "title": "",
                                "description": "",
                                "image":"",
 *                        }
 *                    ]
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */



router.post("/add-WhyChoose-section", addWhyChooseSection.validator, addWhyChooseSection.controller);

/**
 * @swagger
 * /home/get-WhyChoose-section:
 *  get:
 *    tags: [Home]
 *    description: Get WhyChoose Section
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */

router.get("/get-WhyChoose-section", getWhyChooseSection.controller);


/**
 * @swagger
 * /home/add-about-section:
 *  post:
 *    tags: [Home]
 *    description: Add about Section
 *    security:
 *    - Token: []
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          title:
 *            type: string
 *          description:
 *            type: string
 *          image:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */



router.post("/add-about-section", addaboutUsSection.validator, addaboutUsSection.controller);


/**
 * @swagger
 * /home/get-about-section:
 *  get:
 *    tags: [Home]
 *    description: Get About Section
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */

router.get("/get-about-section", getAboutSection.controller);


/**
 * @swagger
 * /home/add-counter-section:
 *  post:
 *    tags: [Home]
 *    description: Add Counter Section
 *    security:
 *    - Token: []
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          counterData:
 *            type: array
 *            example: [
 *                        {
 *                             "image": "",
                                "firstColor": "",
                                "secondColor":"",
                                "thirdColor":"",
                                "number_input":0,
                                "symbol":"",
                                "title":""
 *                        }
 *                    ]
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */


router.post("/add-counter-section", addCounterSection.validator, addCounterSection.controller);

/**
 * @swagger
 * /home/get-counter-section:
 *  get:
 *    tags: [Home]
 *    description: Get Counter Section
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */

router.get("/get-counter-section", getConterSection.controller);


/**
 * @swagger
 * /home/add-speciality-section:
 *  post:
 *    tags: [Home]
 *    description: Add Speciality Section
 *    security:
 *    - Token: []
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          main_title:
 *            type: string
 *          details:
 *            type: string
 *          left_menu:
 *            type: array
 *            example: [
 *                        {
 *                             "image": "",
                                "title": "",
                                "color":"",
                                "gradientColor":""
 *                        }
 *                    ]
 *          right_menu:
 *            type: array
 *            example: [
 *                        {
 *                             "statistics":"",
                                "percentage":0,
                                "color":""
 *                        }
 *                    ]
 *         
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */



router.post("/add-speciality-section", addSpecialitySection.validator, addSpecialitySection.controller);

/**
 * @swagger
 * /home/get-speciality-section:
 *  get:
 *    tags: [Home]
 *    description: Get Speciality Section
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */



router.get("/get-speciality-section", getSpecialitySection.controller);


/**
 * @swagger
 * /home/add-howWork-section:
 *  post:
 *    tags: [Home]
 *    description: Add How we Work Section
 *    security:
 *    - Token: []
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          workSection:
 *            type: array
 *            example: [
 *                        {
 *                             "title": "",
                                "details": "",
                                "image":"",
 *                        }
 *                    ]
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */

router.post("/add-howWork-section", addHowWorkSection.validator, addHowWorkSection.controller);

/**
 * @swagger
 * /home/get-howWork-section:
 *  get:
 *    tags: [Home]
 *    description: Get How We Work Section
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */

router.get("/get-howWork-section", getHowWorkSection.controller);


/**
 * @swagger
 * /home/add-footer-section:
 *  post:
 *    tags: [Home]
 *    description: Add footer Section
 *    security:
 *    - Token: []
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          description:
 *            type: string
 *          copyRight:
 *            type: string
 *          socialIcon:
 *            type: object
 *          facebook:
 *            type: string
 *          instagram:
 *            type: string
 *          twitter:
 *            type: string
 *          linkedIn:
 *            type: string
 *          contactInfo:
 *            type: object
 *          location:
 *            type: string
 *          contact_no:
 *            type: string
 *          email:
 *            type: string
 *          opening_time:
 *            type: string
 *                     
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */

router.post("/add-footer-section", addFooterSection.validator, addFooterSection.controller);

/**
 * @swagger
 * /home/get-footer-section:
 *  get:
 *    tags: [Home]
 *    description: Get Footer Section
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */

router.get("/get-footer-section", getFooterSection.controller);


/**
 * @swagger
 * /home/get-allHome-section:
 *  get:
 *    tags: [Home]
 *    description: Get AllHome Section
 *    responses:
 *      200:
 *        description: Success
 *
 */

router.get("/get-allHome-section", getAllHomeSection.controller);





export default router