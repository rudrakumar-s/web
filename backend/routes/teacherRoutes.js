const express = require("express");
const router = express.Router();
const teacherController = require("./../controllers/teacherController");

// Define routes for all professor operations.
router.route("/").post(teacherController.createNewTeacher);
router.route("/list/:department").get(teacherController.getTeacherList);
router.route("/approve/:department").get(teacherController.getNewTeachers);

// Define routes for specific professor operations based on the student ID.
router
  .route("/:id")
  .get(teacherController.getTeacher)
  .patch(teacherController.approveTeacher)
  .delete(teacherController.deleteTeacher);

module.exports = router;
