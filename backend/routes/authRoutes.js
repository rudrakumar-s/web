const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");

// Define routes for authentication
router.route("/login/teacher").post(authController.teacherLogin);

// Route for student login
router.route("/login/student").post(authController.studentLogin);


module.exports = router;
