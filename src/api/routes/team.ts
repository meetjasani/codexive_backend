import express from "express";
import { addTeam, deleteTeamMember, editTeam, getFilteredTeam, getTeamByUser, teamById } from "../controllers/team";
const router = express.Router();

/**
 * @swagger
 * /team/add-team:
 *  post:
 *    tags: [Team]
 *    description: Add Team
 *    security:
 *    - Token: []
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
 *          id_number:
 *            type: string
 *          image:
 *            type: string
 *          skill:
 *            type: string
 *          member_type:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 */
router.post("/add-team", addTeam.validator, addTeam.controller);

/**
 * @swagger
 * /team/edit-team/{id}:
 *  put:
 *    tags: [Team]
 *    description: edit Team
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
 *          first_name:
 *            type: string
 *          last_name:
 *            type: string
 *          id_number:
 *            type: string
 *          image:
 *            type: string
 *          skill:
 *            type: string
 *          member_type:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.put(
  "/edit-team/:id",
  editTeam.validator,
  editTeam.controller
);

/**
 * @swagger
 * /team/get-team-by-id/{id}:
 *  get:
 *    tags: [Team]
 *    description: Get Team by ID
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
router.get("/get-team-by-id/:id", teamById.validator, teamById.controller);

/**
  * @swagger
  * /team/delete-team-member:
  *  put:
  *    tags: [Team]
  *    description: Delete Team Member
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
  "/delete-team-member",
  deleteTeamMember.validator,
  deleteTeamMember.controller
);

/**
 * @swagger
 * /team/get-team-by-user:
 *  get:
 *    tags: [Team]
 *    description: Get Team By User
*    parameters:
 *    - in: query
 *      name: member_type
 *      required: false
 *      type: string
 *    responses:
 *      200:
 *        description: Success
 *
 */
router.get("/get-team-by-user", getTeamByUser.validator, getTeamByUser.controller);

/**
 * @swagger
 * /team/get-filtered-team:
 *  get:
 *    tags: [Team]
 *    description: Get Team
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
  "/get-filtered-team",
  getFilteredTeam.validator,
  getFilteredTeam.controller
);

export default router;