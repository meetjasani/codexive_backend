import express from "express";
import { upload } from "../../utils/multer";
import { addContectUs, addSetting, fileAndImageUpload, getCareerSetting, getFilteredContectUs, getMenuSetting, getSettingByID } from "../controllers";
const router = express.Router();


/**
 * @swagger
 * /general/file-and-image-upload:
 *  post:
 *    tags: [General]
 *    description: File And Image Upload
 *    security:
 *    - Token: []
 *    parameters:
 *    - in: form-data
 *      name: image
 *      required: true
 *      type: file
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.post(
    "/file-and-image-upload",
    upload.any(),
    fileAndImageUpload.controller
);

/**
 * @swagger
 * /general/add-contect-us:
 *  post:
 *    tags: [General]
 *    description: Add ContectUs
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          first_name:
 *            type: string
 *          email:
 *            type: string
 *          phone_no:
 *            type: string
 *          website:
 *            type: string
 *          message:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */
router.post("/add-contect-us", addContectUs.validator, addContectUs.controller)

/**
 * @swagger
 * /general/get-filtered-contect-us:
 *  get:
 *    tags: [General]
 *    description: Get Contect Us
 *    security:
 *    - Token: []
 *    parameters:
 *    - in: query
 *      name: search_term
 *      required: false
 *      type: string
 *    - in: query
 *      name: per_page
 *      type: number
 *      required: false
 *    - in: query
 *      name: page_number
 *      type: number
 *      required: false
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */

router.get(
    "/get-filtered-contect-us",
    getFilteredContectUs.validator,
    getFilteredContectUs.controller
);


/**
 * @swagger
 * /general/add-setting:
 *  post:
 *    tags: [General]
 *    description: Add Setting
 *    security:
 *    - Token: []
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          username:
 *            type: string
 *          password:
 *            type: string
 *          discription:
 *            type: string
 *          key_point:
 *            type: string
 *          let_s_talk:
 *            type: string
 *          setting:
 *            type: array
 *            example: [
 *                        {
 *                            "form_name": "",
 *                            "is_active": false,
 *                        }
 *                    ]
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */
router.post("/add-setting", addSetting.validator, addSetting.controller)

/**
 * @swagger
 * /general/get-setting-by-id:
 *  get:
 *    tags: [General]
 *    description: Get Setting
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */

router.get(
    "/get-setting-by-id",
    getSettingByID.controller
);


/**
 * @swagger
 * /general/get-menu-setting:
 *  get:
 *    tags: [General]
 *    description: Get Menu Setting
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */

router.get(
    "/get-menu-setting",
    getMenuSetting.controller
);

/**
 * @swagger
 * /general/get-career-setting:
 *  get:
 *    tags: [General]
 *    description: Get career Setting
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */

router.get(
    "/get-career-setting",
    getCareerSetting.controller
);

export default router;
