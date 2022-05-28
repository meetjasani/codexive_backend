import express from "express";
import { addBlog, blogById, deleteBlog, editBlog, getBlogsByUser, getFilteredBlogs } from "../controllers/blog";
const router = express.Router();

/**
 * @swagger
 * /blog/add-addBlog:
 *  post:
 *    tags: [Blog]
 *    description: Add Blog
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
 *          technologies:
 *            type: string
 *          image:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */
router.post("/add-blog", addBlog.validator, addBlog.controller);

/**
* @swagger
* /blog/edit-blog/{id}:
*  put:
*    tags: [Blog]
*    description: edit Company Blog
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
*          title:
*            type: string
*          details:
*            type: string
*          technologies:
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
    "/edit-blog/:id",
    editBlog.validator,
    editBlog.controller
);

/**
 * @swagger
 * /blog/get-blog-by-id/{id}:
 *  get:
 *    tags: [Blog]
 *    description: Get Company Blog by ID
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
router.get("/get-blog-by-id/:id", blogById.validator, blogById.controller);

/**
 * @swagger
 * /blog/delete-blog-by-admin:
 *  post:
 *    tags: [Blog]
 *    description: Delete Company Blog
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
    "/delete-blog-by-admin",
    deleteBlog.validator,
    deleteBlog.controller
);

/**
 * @swagger
 * /blog/get-blogs-by-user:
 *  get:
 *    tags: [Blog]
 *    description: Get Blogs By User
 *    responses:
 *      200:
 *        description: Success
 *
 */
router.get("/get-blogs-by-user", getBlogsByUser.controller);

/**
* @swagger
* /blog/get-blogs-by-admin:
*  get:
*    tags: [Blog]
*    description: Get Blogs By Admin
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
    "/get-blogs-by-admin",
    getFilteredBlogs.validator,
    getFilteredBlogs.controller
);


export default router;