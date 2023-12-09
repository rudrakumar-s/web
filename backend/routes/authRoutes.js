const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");
// const { generalLogin } = require('../controllers/authController');

router.route("/login/teacher").post(authController.teacherLogin);
router.route("/login/student").post(authController.studentLogin);
// router.route('/login', authController.generalLogin);
// // Inside authRoutes.js

// router.route('/login').post(authController.generalLogin);
// router.post('/login', (req, res) => {
//     res.send('Login route is working');
//   });

//   router.post('/login', generalLogin);
  

//? Incase of JWT
//   .route("/logout")
//   .post(authController.logout);

module.exports = router;
