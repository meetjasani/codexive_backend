import express from "express";
import { addTermAndCondition, getNoAuthTermAndCondition, getTermAndCondition } from "../controllers/termAndCondition";
const router = express.Router();



/**
 * @swagger
 * /term/add-term-and-condition:
 *  post:
 *    tags: [TermAndCondition]
 *    description: Add Term And Condition Section
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
router.post("/add-term-and-condition", addTermAndCondition.validator, addTermAndCondition.controller)

/**
 * @swagger
 * /term/get-term-and-condition:
 *  get:
 *    tags: [TermAndCondition]
 *    description: Get Term And Condition Section
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */

router.get("/get-term-and-condition", getTermAndCondition.controller)

/**
 * @swagger
 * /term/get-noAuth-term-and-condition:
 *  get:
 *    tags: [TermAndCondition]
 *    description: Get Term And Condition Section
 *    responses:
 *      200:
 *        description: Success
 *
 */

router.get("/get-noAuth-term-and-condition", getNoAuthTermAndCondition.controller)




export default router