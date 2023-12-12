const express = require("express");
const router = express.Router();
const attendanceController = require("./../controllers/attendanceController");

// TODO Student Side
// Route for fetching attendance data for a specific student on a specific date
router
  .route("/student/:studentId/:date")
  .get(attendanceController.getAttendanceStudent);

  // Routes for managing attendance for a specific paper, date, and hour

router
  .route("/:paper/:date/:hour")
  .get(attendanceController.getAttendance)
  .post(attendanceController.addAttendance)
  .patch(attendanceController.updateAttendance);


// Route for deleting attendance data

router.route("/:id").delete(attendanceController.deleteAttendance);

module.exports = router;
