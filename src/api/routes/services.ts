import express from "express";
import { addService, deleteServicesById, editServices, getAllServices, getAllServicesByName, getServicesById, getServicesBySubId } from "../controllers/services";

const router = express.Router();

/**
 * @swagger
 * /service/add-service:
 *  post:
 *    tags: [Services]
 *    description: Add Services
 *    security:
 *    - Token: []
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          main_service:
 *            type: string
 *          sub_services:
 *            type: string
 *          sub_services_id:
 *            type: string
 *          title:
 *            type: string
 *          description:
 *            type: string
 *          image:
 *            type: string
 *          title_second:
 *            type: string
 *          description_second:
 *            type: string
 *          image_second:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */
router.post("/add-service", addService.validator, addService.controller)

/**
 * @swagger
 * /service/edit-service:
 *  put:
 *    tags: [Services]
 *    description: edit Services
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
 *          main_service:
 *            type: string
 *          sub_services:
 *            type: string
 *          sub_services_id:
 *            type: string
 *          title:
 *            type: string
 *          description:
 *            type: string
 *          image:
 *            type: string
 *          title_second:
 *            type: string
 *          description_second:
 *            type: string
 *          image_second:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */
router.put("/edit-Services/:id", editServices.validator, editServices.controller)

/**
 * @swagger
 * /service/delete-service:
 *  put:
 *    tags: [Services]
 *    description: delete Services
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
router.put("/delete-service", deleteServicesById.validator, deleteServicesById.controller)


/**
 * @swagger
 * /service/getAllService:
 *  get:
 *    tags: [Services]
 *    description: Get All Services
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */
router.get("/getAllService", getAllServices.controller)


/**
 * @swagger
 * /service/getAllServiceById/{id}:
 *  get:
 *    tags: [Services]
 *    description: Get All Services By Id
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */
router.get("/getAllServiceById/:id", getServicesById.validator, getServicesById.controller)

/**
 * @swagger
 * /service/getAllServiceBySubId/{subid}:
 *  get:
 *    tags: [Services]
 *    description: Get All Services By subId
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */
router.get("/getAllServiceBySubId/:id", getServicesBySubId.validator, getServicesBySubId.controller)

/**
 * @swagger
 * /service/getAllServicesByName/{name}:
 *  get:
 *    tags: [Services]
 *    description: Get All Services By name
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */
router.get("/getAllServicesByName/:name", getAllServicesByName.validator, getAllServicesByName.controller)

export default router