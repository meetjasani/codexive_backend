import express from "express";
import { addTechnology, deleteTechnology, editTechnology, getAllTechnology, getTechnologyById, getTechnologyByType } from "../controllers/allTechnology";

const router = express.Router();

/**
 * @swagger
 * /technology/add-technology:
 *  post:
 *    tags: [Technology]
 *    description: Add Technology
 *    security:
 *    - Token: []
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          type:
 *            type: string
 *          name:
 *            type: string
 *          image:
 *            type: string
 *          firstColor:
 *            type: string
 *          secondColor:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */
router.post("/add-technology", addTechnology.validator, addTechnology.controller)

/**
 * @swagger
 * /technology/edit-technology:
 *  put:
 *    tags: [Technology]
 *    description: edit Technology
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
 *          type:
 *            type: string
 *          name:
 *            type: string
 *          image:
 *            type: string
 *          firstColor:
 *            type: string
 *          secondColor:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */
router.put("/edit-technology/:id", editTechnology.validator, editTechnology.controller)


/**
 * @swagger
 * /technology/delete-technology:
 *  put:
 *    tags: [Technology]
 *    description: delete Technology
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
 */
router.put("/delete-technology", deleteTechnology.validator, deleteTechnology.controller)

/**
 * @swagger
 * /technology/getAlltechnology:
 *  get:
 *    tags: [Technology]
 *    description: Get All Technology
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */
router.get("/getAlltechnology", getAllTechnology.validator, getAllTechnology.controller)

/**
 * @swagger
 * /technology/getTechnologyById/{id}:
 *  get:
 *    tags: [Technology]
 *    description: Get All Technology By Id
 *    security:
 *    - Token: []
*    parameters:
*    - in: path
*      name: id
*      type: string
*      required: true
 *    responses:
 *      200:
 *        description: Success
 *
 */
router.get("/getTechnologyById/:id", getTechnologyById.validator, getTechnologyById.controller)

/**
 * @swagger
 * /technology/getTechnologyByType:
 *  get:
 *    tags: [Technology]
 *    description: Get All Technology By Type
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */
router.get("/getTechnologyByType", getTechnologyByType.controller)

export default router