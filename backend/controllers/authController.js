const Teacher = require("./../models/Teacher");
const Student = require("./../models/Student");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // Adjust this based on your user model


// @desc Auth Login
// @route POST /auth/login/teacher
// @access Public
const teacherLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All Fields are required" });
  }
  const teacher = await Teacher.findOne({ username }).exec();

  if (!teacher) {
    return res.status(404).json({ message: "User not found" });
  }
  if (!teacher.role) {
    return res.status(418).json({ message: "User not Approved" });
  }

  const match = await bcrypt.compare(password, teacher.password);
  if (!match) return res.status(401).json({ message: "Incorrect Password" });
  else {
    res.status(200).json({
      _id: teacher.id,
      name: teacher.name,
      role: teacher.role,
      department: teacher.department,
    });
  }
});

// // @desc Auth Login
// // @route POST /auth/login/student
// // @access Public
const studentLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All Fields are required" });
  }
  const student = await Student.findOne({ username }).exec();

  if (!student) {
    return res.status(404).json({ message: "User not found" });
  }

  const match = await bcrypt.compare(password, student.password);
  if (!match) return res.status(401).json({ message: "Incorrect Password" });
  else {
    res.status(200).json({
      _id: student.id,
      name: student.name,
      role: "student",
    });
  }
});

// // @desc Auth Logout
// // @route POST /auth/logout
// // @access Public
// const logout = asyncHandler(async (req, res) => {});





// In your authController.js


// General login function for any user type
const generalLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All Fields are required" });
  }

  const user = await User.findOne({ username }).exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!user.role) {
    return res.status(418).json({ message: "User not Approved" });
  }

//   const match = await bcrypt.compare(password, user.password);
  const match = user.password;


  if (!match) return res.status(401).json({ message: "Incorrect Password" });

  res.status(200).json({
    _id: user.id,
    name: user.name,
    role: user.role
    // Add other necessary user details but exclude sensitive information
  });
});

module.exports = { generalLogin };

module.exports = { teacherLogin, studentLogin };