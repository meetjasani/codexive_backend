import express from "express";
import { addPrivacyPolicy, getNoAuthPrivacyPolicy, getPrivacyPolicy } from "../controllers/privacyPolicy";
const router = express.Router();


/**
 * @swagger
 * /policy/add-privacy-policy:
 *  post:
 *    tags: [PrivacyPolicy]
 *    description: Add Privacy Policy Section
 *    security:
 *    - Token: []
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          details:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */
router.post("/add-privacy-policy", addPrivacyPolicy.validator, addPrivacyPolicy.controller)


/**
 * @swagger
 * /policy/get-privacy-policy:
 *  get:
 *    tags: [PrivacyPolicy]
 *    description: Get Privacy Policy Section
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */

router.get("/get-privacy-policy", getPrivacyPolicy.controller)

/**
 * @swagger
 * /policy/get-noAuth-privacy-policy:
 *  get:
 *    tags: [PrivacyPolicy]
 *    description: Get Privacy Policy Section
 *    responses:
 *      200:
 *        description: Success
 *
 */

router.get("/get-noAuth-privacy-policy", getNoAuthPrivacyPolicy.controller)




export default router