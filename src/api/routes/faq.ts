import express from "express";
import { addFAQ, deleteFAQ, editFAQ, getByIdFAQ, getFAQ, getNoAuthFAQ } from "../controllers/faq";
const router = express.Router();




/**
* @swagger
* /faq/get-faq:
*  get:
*    tags: [Faq]
*    description: Get Faq Section
*    security:
*    - Token: []
*    parameters:
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
router.get("/get-faq", getFAQ.validator, getFAQ.controller)

/**
 * @swagger
 * /faq/add-faq:
 *  post:
 *    tags: [Faq]
 *    description: Add Faq Section
 *    security:
 *    - Token: []
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          question:
 *            type: string
 *          answer:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */

router.post("/add-faq", addFAQ.validator, addFAQ.controller)


/**
* @swagger
* /faq/get-faq/{id}:
*  get:
*    tags: [Faq]
*    description: Get Faq Section by ID
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

router.get("/get-faq/:id", getByIdFAQ.validator, getByIdFAQ.controller)

/**
* @swagger
* /faq/edit-faq/{id}:
*  put:
*    tags: [Faq]
*    description: edit Faq Section
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
*          question:
*            type: string
*          answer:
*            type: string
*    responses:
*      200:
*        description: Success
*        content: {}
*
*/


router.put("/edit-faq/:id", editFAQ.validator, editFAQ.controller)

/**
 * @swagger
 * /faq/delete-faq:
 *  put:
 *    tags: [Faq]
 *    description: Delete Faq Section
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


router.put("/delete-faq", deleteFAQ.validator, deleteFAQ.controller)


/**
* @swagger
* /faq/get-noAuth-faq:
*  get:
*    tags: [Faq]
*    description: Get Faq Section
*    parameters:
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
*
*/


router.get("/get-noAuth-faq", getNoAuthFAQ.validator, getNoAuthFAQ.controller)



export default router