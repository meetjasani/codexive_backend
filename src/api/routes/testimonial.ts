import express from "express";
import { addBlog, blogById, deleteBlog, editBlog, getBlogsByUser, getFilteredBlogs } from "../controllers/blog";
import { addTestimonial, deleteTestimonial, editTestimonial, getFilteredTestimonial, getTestimonialByUser, testimonialById } from "../controllers/testimonial.";
const router = express.Router();

/**
 * @swagger
 * /testimonial/add-testimonial:
 *  post:
 *    tags: [Testimonial]
 *    description: Add Testimonial
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
 *          image:
 *            type: string
 *          testimonial:
 *            type: string
 *          position:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */
router.post("/add-testimonial", addTestimonial.validator, addTestimonial.controller);

/**
* @swagger
* /testimonial/edit-testimonial/{id}:
*  put:
*    tags: [Testimonial]
*    description: edit Testimonial
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
*          image:
*            type: string
*          testimonial:
*            type: string
*          position:
*            type: string
*    responses:
*      200:
*        description: Success
*        content: {}
*
*/
router.put(
    "/edit-testimonial/:id",
    editTestimonial.validator,
    editTestimonial.controller
);

/**
 * @swagger
 * /testimonial/get-testimonial-by-id/{id}:
 *  get:
 *    tags: [Testimonial]
 *    description: Get Company Testimonial by ID
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
router.get("/get-testimonial-by-id/:id", testimonialById.validator, testimonialById.controller);

/**
 * @swagger
 * /testimonial/delete-testimonial-by-admin:
 *  post:
 *    tags: [Testimonial]
 *    description: Delete Company Testimonial
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
 * 
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.put(
    "/delete-testimonial-by-admin",
    deleteTestimonial.validator,
    deleteTestimonial.controller
);

/**
 * @swagger
 * /testimonial/get-testimonial-by-user:
 *  get:
 *    tags: [Testimonial]
 *    description: Get Testimonial By User
 *    responses:
 *      200:
 *        description: Success
 *
 */
router.get("/get-testimonial-by-user", getTestimonialByUser.controller);

/**
* @swagger
* /testimonial/get-testimonial-by-admin:
*  get:
*    tags: [Testimonial]
*    description: Get Testimonial By Admin
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
    "/get-testimonial-by-admin",
    getFilteredTestimonial.validator,
    getFilteredTestimonial.controller
);


export default router;