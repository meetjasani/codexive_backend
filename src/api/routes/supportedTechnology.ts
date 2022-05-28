import express from "express";
import { addSupportedTechnology, getNoAuthSupportedTechnology, getSupportedTechnology } from "../controllers/supportedTechnology";
const router = express.Router();


/**
 * @swagger
 * /technology/get-supported-technology:
 *  get:
 *    tags: [SupportedTechnology]
 *    description: Get Supported Technology Section
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */

router.get("/get-supported-technology", getSupportedTechnology.controller)

/**
 * @swagger
 * /technology/add-supported-technology:
 *  post:
 *    tags: [SupportedTechnology]
 *    description: Add Supported Technology Section
 *    security:
 *    - Token: []
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          technology:
 *            type: array
 *            example: [
 *                        {
 *                             "title": "",
                                "image":"",
 *                        }
 *                    ]
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */

router.post("/add-supported-technology", addSupportedTechnology.validator, addSupportedTechnology.controller)

/**
 * @swagger
 * /technology/get-noAuth-supported-technology:
 *  get:
 *    tags: [SupportedTechnology]
 *    description: Get Supported Technology Section
 *    responses:
 *      200:
 *        description: Success
 *
 */

router.get("/get-noAuth-supported-technology", getNoAuthSupportedTechnology.controller)


export default router