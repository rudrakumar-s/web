const Teacher = require("./../models/Teacher");
const Student = require("./../models/Student");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // Adjust this based on your user model


// Teacher login handler
const teacherLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;    // Extract username and password from request body

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

  // Check if password matches
  const match = await bcrypt.compare(password, teacher.password);
  if (!match) return res.status(401).json({ message: "Incorrect Password" });
  else {

    // Return teacher details if login is successful
    res.status(200).json({
      _id: teacher.id,
      name: teacher.name,
      role: teacher.role,
      department: teacher.department,
    });
  }
});

// student login
const studentLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All Fields are required" });
  }

  // Find the user with the given username
  const student = await Student.findOne({ username }).exec();

  if (!student) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if password matches (Here, it seems like the password comparison is missing)
  const match = await bcrypt.compare(password, student.password);
  if (!match) return res.status(401).json({ message: "Incorrect Password" });
  else {

    // Return user details if login is successful
    res.status(200).json({
      _id: student.id,
      name: student.name,
      role: "student",
    });
  }
});

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