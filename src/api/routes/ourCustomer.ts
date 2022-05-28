

import express from "express";
import { addOurCustomerSection, getNoAuthOurCustomerSection, getOurCustomerSection } from "../controllers/oueCustomer";
const router = express.Router();






/**
 * @swagger
 * /customer/add-ourCustomer-section:
 *  post:
 *    tags: [OurCustomer]
 *    description: Add Our Customer Section
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
 *          customer:
 *            type: array
 *            example: [
 *                        {
 *                             "name": "",
                                "image": "",
                                "customer_title":"",
                                "customer_description":""
 *                        }
 *                    ]
 *         
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */

router.post("/add-ourCustomer-section", addOurCustomerSection.validator, addOurCustomerSection.controller);


/**
 * @swagger
 * /customer/get-ourCustomer-section:
 *  get:
 *    tags: [OurCustomer]
 *    description: Get Our Customer Section
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */


router.get("/get-ourCustomer-section", getOurCustomerSection.controller);

/**
 * @swagger
 * /customer/get-noAuth-ourCustomer-section:
 *  get:
 *    tags: [OurCustomer]
 *    description: Get Our Customer Section
 *    responses:
 *      200:
 *        description: Success
 *
 */


router.get("/get-noAuth-ourCustomer-section", getNoAuthOurCustomerSection.controller);

export default router
