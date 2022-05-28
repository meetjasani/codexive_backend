import express from "express";
import { addHomePortfolio, getHomePortfolio } from "../controllers/homePortfolio";
const router = express.Router();




/**
 * @swagger
 * /home/add-home-portfolio:
 *  post:
 *    tags: [Home]
 *    description: Add HomePage Portfolio Section
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
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */

router.post("/add-home-portfolio", addHomePortfolio.validator, addHomePortfolio.controller)


/**
 * @swagger
 * /home/get-home-portfolio:
 *  get:
 *    tags: [Home]
 *    description: Get HomePage Portfolio Section
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */

router.get("/get-home-portfolio", getHomePortfolio.controller)


export default router