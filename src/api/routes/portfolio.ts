import express from "express";
import { addCompanyPortfolio, deletePortfolio, editCompanyPortfolio, getFilteredPortfolio, getPortfolioByUser, portfolioById } from "../controllers/portfolio";
const router = express.Router();

/**
 * @swagger
 * /portfolio/add-company-portfolio:
 *  post:
 *    tags: [Portfolio]
 *    description: Add Company Portfolio
 *    security:
 *    - Token: []
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *          introduction:
 *            type: string
 *          key_features:
 *            type: string
 *          technical_overview:
 *            type: string
 *          main_image:
 *            type: string
 *          image:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */
router.post("/add-company-portfolio", addCompanyPortfolio.validator, addCompanyPortfolio.controller);

/**
 * @swagger
 * /portfolio/edit-company-portfolio/{id}:
 *  put:
 *    tags: [Portfolio]
 *    description: edit Company Portfolio
 *    security:
 *    - Token: []
 *    parameters:
 *    - in: path
 *      name: id
 *      type: string
 *      required: true
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *          introduction:
 *            type: string
 *          key_features:
 *            type: string
 *          technical_overview:
 *            type: string
 *          main_image:
 *            type: string
 *          image:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.put(
  "/edit-company-portfolio/:id",
  editCompanyPortfolio.validator,
  editCompanyPortfolio.controller
);

/**
 * @swagger
 * /portfolio/get-company-portfolio-by-id/{id}:
 *  get:
 *    tags: [Portfolio]
 *    description: Get Company Portfolio by ID
 *    security:
 *    - Token: []
 *    parameters:
 *    - in: path
 *      name: id
 *      required: true
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.get("/get-company-portfolio-by-id/:id", portfolioById.validator, portfolioById.controller);

/**
  * @swagger
  * /portfolio/delete-company-portfolio-by-admin:
  *  post:
  *    tags: [Portfolio]
  *    description: Delete Company Portfolio
  *    security:
  *    - Token: []
  *    parameters:
  *    - in: body
  *      name: body
  *      required: true
  *      schema:
  *        type: object
  *        properties:
  *          id:
  *            type: string
  *    responses:
  *      200:
  *        description: Success
  *        content: {}
  *
  */
router.put(
  "/delete-company-portfolio-by-admin",
  deletePortfolio.validator,
  deletePortfolio.controller
);

/**
 * @swagger
 * /portfolio/get-company-portfolio-by-user:
 *  get:
 *    tags: [Portfolio]
 *    description: Get Company Portfolio By User
 *    parameters: 
 *    - in: path
 *      name: id
 *      type: string
 *      required: true
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */
router.get("/get-company-portfolio-by-user/:categoryId",getPortfolioByUser.validator, getPortfolioByUser.controller);

/**
 * @swagger
 * /portfolio/get-company-portfolio-by-admin:
 *  get:
 *    tags: [Portfolio]
 *    description: Get Company Portfolio
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
  "/get-company-portfolio-by-admin",
  getFilteredPortfolio.validator,
  getFilteredPortfolio.controller
);

export default router;