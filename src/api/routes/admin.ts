import express from "express";
import { userRole } from "../../utils/middlewares";
import {
  addUser,
  checkLogin,
  deleteUserByAdmin,
  editUser,
  getFilteredUsers,
  getUsers,
  login,
  setPassword,
  userById,
  validateAdmin,
} from "../controllers/admin";

const router = express();

/**
 * @swagger
 * /admin/auth/checkLogin:
 *  post:
 *    tags: [Admin]
 *    description: Check Login
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *
 */
router.post("/auth/checkLogin", checkLogin.validator, checkLogin.controller);

/**
 * @swagger
 * /admin/setPassword:
 *  put:
 *    tags: [Admin]
 *    description: Set Password
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *          password:
 *            type: string
 *          role_type:
 *            type: string
 *          is_login_first:
 *            type: boolean
 *    responses:
 *      200:
 *        description: Success
 *
 */
router.put(
  "/setPassword",
  setPassword.validator,
  setPassword.controller
);

/**
 * @swagger
 * /admin/auth/login:
 *  post:
 *    tags: [Admin]
 *    description: Admin Login
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *          password:
 *            type: string
 *          role_type:
 *            type: string
 *          is_login_first:
 *            type: boolean
 *    responses:
 *      200:
 *        description: Success
 *
 */
router.post("/auth/login", login.validator, login.controller);

/**
 * @swagger
 * /admin/validate:
 *  get:
 *    tags: [Admin]
 *    description: Admin Validate
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */
router.get("/validate", userRole, validateAdmin.controller);

/**
 * @swagger
 * /admin/addUser:
 *  post:
 *    tags: [Admin]
 *    description: Add user by admin
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          last_name:
 *            type: string
 *          first_name:
 *            type: string
 *          email:
 *            type: string
 *          role_type:
 *            type: string
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */
router.post(
  "/addUser",
  userRole,
  addUser.validator,
  addUser.controller
);

/**
 * @swagger
 * /admin/editUser/{id}:
 *  patch:
 *    tags: [Admin]
 *    description: Edit User
 *    security:
 *    - Token: []
 *    parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      type: string
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          last_name:
 *            type: string
 *          first_name:
 *            type: string
 *          email:
 *            type: string
 *          role_type:
 *            type: string
 *          password_chnage:
 *            type: boolean
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.patch(
  "/editUser/:id",
  userRole,
  editUser.validator,
  editUser.controller
);

/**
 * @swagger
 * /admin/auth/deleteUser:
 *  put:
 *    tags: [Admin]
 *    description: Delete User
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
  "/auth/deleteUser",
  userRole,
  deleteUserByAdmin.validator,
  deleteUserByAdmin.controller
);

/**
 * @swagger
 * /admin/users:
 *  get:
 *    tags: [Admin]
 *    description: Get Users
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *
 */
router.get("/users", userRole, getUsers.controller);

/**
 * @swagger
 * /admin/{id}:
 *  get:
 *    tags: [Admin]
 *    description: get User By Id
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
 *        content: {}
 *
 */
router.get("/:id", userById.validator, userRole, userById.controller);

/**
 * @swagger
 * /admin/auth/getFilteredUsers:
 *  get:
 *    tags: [Admin]
 *    description: Get Filtered User`
 *    security:
 *    - Token: []
 *    parameters:
 *    - in: query
 *      name: start_date
 *      required: false
 *      type: string
 *    - in: query
 *      name: end_date
 *      required: false
 *      type: string
 *    - in: query
 *      name: search_term
 *      required: false
 *      type: string
 *    - in: query
 *      name: per_page
 *      type: number
 *      required: true
 *    - in: query
 *      name: page_number
 *      type: number
 *      required: true
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */

router.get(
  "/auth/getFilteredUsers",
  getFilteredUsers.validator,
  getFilteredUsers.controller
);

export default router;
