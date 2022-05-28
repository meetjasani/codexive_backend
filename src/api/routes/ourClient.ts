import express from "express";
import { addClient, deleteClientById, editClient, getAllClient, getClientById } from "../controllers/ourClient";

const router = express.Router();

/**
 * @swagger
 * /client/add-client:
 *  post:
 *    tags: [OurClient]
 *    description: Add Client
 *    security:
 *    - Token: []
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          clientInfo:
 *            type: string
 *          image:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */
router.post("/add-client", addClient.validator, addClient.controller)

/**
 * @swagger
 * /client/edit-client/{id}:
 *  put:
 *    tags: [OurClient]
 *    description: edit Client
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
*          clientInfo:
 *            type: string
 *          image:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */
router.put("/edit-client/:id", editClient.validator, editClient.controller)

/**
 * @swagger
 * /client/delete-client:
 *  put:
 *    tags: [OurClient]
 *    description: delete Client
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
router.put("/delete-client", deleteClientById.validator, deleteClientById.controller)

/**
 * @swagger
 * /client/getallcategorybyadmin:
 *  get:
 *    tags: [OurClient]
 *    description: Get All Client
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */
router.get("/getAllClient", getAllClient.validator, getAllClient.controller)

/**
 * @swagger
 * /client/getClientById/{id}:
 *  get:
 *    tags: [OurClient]
 *    description: Get All Client By Id
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
router.get("/getClientById/:id", getClientById.validator, getClientById.controller)

export default router