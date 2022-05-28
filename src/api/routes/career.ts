import express from "express";
import { addCareerRequest, addCareerRequirement, careerRequirementById, deleteCareerRequirement, editCareerRequirement, getCareerRequirementByUser, getFilteredCareerRequest, getFilteredCareerRequirement } from "../controllers/career";
const router = express.Router();

/**
 * @swagger
 * /career/add-career-requirement:
 *  post:
 *    tags: [CareerRequirement]
 *    description: Add Career Requirement
 *    security:
 *    - Token: []
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          position:
 *            type: string
 *          requirement:
 *            type: string
 *          experience:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */
router.post("/add-career-requirement", addCareerRequirement.validator, addCareerRequirement.controller);

/**
 * @swagger
 * /career/edit-career-requirement/{id}:
 *  put:
 *    tags: [CareerRequirement]
 *    description: edit career requirement
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
 *          position:
 *            type: string
 *          requirement:
 *            type: string
 *          experience:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.put(
  "/edit-career-requirement/:id",
  editCareerRequirement.validator,
  editCareerRequirement.controller
);

/**
 * @swagger
 * /career/get-career-requirement-by-id/{id}:
 *  get:
 *    tags: [CareerRequirement]
 *    description: Get Career Requirement by ID
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
router.get("/get-career-requirement-by-id/:id", careerRequirementById.validator, careerRequirementById.controller);

/**
  * @swagger
  * /career/delete-career-requirement:
  *  put:
  *    tags: [CareerRequirement]
  *    description: Delete Career Requirement
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
  "/delete-career-requirement",
  deleteCareerRequirement.validator,
  deleteCareerRequirement.controller
);

/**
 * @swagger
 * /career/get-career-requirement-by-user:
 *  get:
 *    tags: [CareerRequirement]
 *    description: Get Career Requirement By User
 *    responses:
 *      200:
 *        description: Success
 *
 */
router.get("/get-career-requirement-by-user", getCareerRequirementByUser.controller);

/**
 * @swagger
 * /career/get-filtered-career-requirement:
 *  get:
 *    tags: [CareerRequirement]
 *    description: Get Career Requirement
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
  "/get-filtered-career-requirement",
  getFilteredCareerRequirement.validator,
  getFilteredCareerRequirement.controller
);

/**
 * @swagger
 * /career/add-career-request:
 *  post:
 *    tags: [CareerRequirement]
 *    description: Add Career Request
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          first_name:
 *            type: string
 *          last_name:
 *            type: string
 *          career_requirement:
 *            type: string
 *          experiance:
 *            type: string
 *          current_company:
 *            type: string
 *          resume:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */
router.post("/add-career-request", addCareerRequest.validator, addCareerRequest.controller);

/**
 * @swagger
 * /career/get-filtered-career-request:
 *  get:
 *    tags: [CareerRequirement]
 *    description: Get Career Request
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
  "/get-filtered-career-request",
  getFilteredCareerRequest.validator,
  getFilteredCareerRequest.controller
);


export default router;