import express from "express";
import { addsevicesDetails, getNoAuthServicesDetails, getServicesDetails } from "../controllers/servicesDetails";
const router = express.Router();




/**
 * @swagger
 * /servicesDetails/add-services-details:
 *  get:
 *    tags: [ServicesDetails]
 *    description: Get Services Details Section
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */

router.get("/get-services-details", getServicesDetails.controller)


/**
 * @swagger
 * /servicesDetails/add-services-details:
 *  post:
 *    tags: [ServicesDetails]
 *    description: Add Services Details Section
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
 *          details:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */


router.post("/add-services-details", addsevicesDetails.validator, addsevicesDetails.controller)

/**
 * @swagger
 * /servicesDetails/get-noAuth-services-details:
 *  get:
 *    tags: [ServicesDetails]
 *    description: Get Services Details Section
 *    responses:
 *      200:
 *        description: Success
 *
 */

router.get("/get-noAuth-services-details", getNoAuthServicesDetails.controller)



export default router