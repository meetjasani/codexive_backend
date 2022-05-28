import express from "express";
import { addContectUs } from "../controllers";
import { addCategory, categoryDropDown, categoryDropDownById, categoryDropDownByParent, deleteCategory, editCategory, getAllCategoryByAdmin } from "../controllers/category";
const router = express.Router();

/**
 * @swagger
 * /category/add-category:
 *  post:
 *    tags: [Category]
 *    description: Add Category
 *    security:
 *    - Token: []
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          category:
 *            type: string
 *          parent_category_id:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */
router.post("/add-category", addCategory.validator, addCategory.controller)


/**
* @swagger
* /category/edit-category/{id}:
*  put:
*    tags: [Category]
*    description: edit Category
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
*          category:
 *            type: string
 *          parent_category_id:
 *            type: string
*    responses:
*      200:
*        description: Success
*        content: {}
*
*/
router.put("/edit-category/:id", editCategory.validator, editCategory.controller)


/**
 * @swagger
 * /category/delete-category:
 *  put:
 *    tags: [Category]
 *    description: Delete Category
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

router.put("/delete-category", deleteCategory.validator, deleteCategory.controller)

/**
 * @swagger
 * /category/getallcategorybyadmin:
 *  get:
 *    tags: [Category]
 *    description: Get All Category
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */
router.get("/getallcategorybyadmin", getAllCategoryByAdmin.controller)

/**
 * @swagger
 * /category/categoryDropDown:
 *  get:
 *    tags: [Category]
 *    description: Get All Category
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */
router.get("/categoryDropDown", categoryDropDown.controller)

/**
 * @swagger
 * /category/categoryDropDownByParent/{parentId}:
 *  get:
 *    tags: [Category]
 *    description: Get All Category
 *    security:
 *    - Token: []
*    parameters:
*    - in: path
*      name: parentId
*      type: string
*      required: true
 *    responses:
 *      200:
 *        description: Success
 *
 */
router.get("/categoryDropDownByParent/:parentId", categoryDropDownByParent.validator, categoryDropDownByParent.controller)

/**
 * @swagger
 * /category/categoryDropDownById/{id}:
 *  get:
 *    tags: [Category]
 *    description: Get All Category
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
router.get("/categoryDropDownById/:id", categoryDropDownById.validator, categoryDropDownById.controller)



export default router