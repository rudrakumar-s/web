const express = require("express");
const router = express.Router();
const timeScheduleController = require("./../controllers/timeScheduleController");

// Define routes for specific time schedule operations based on the teacher's ID.
router
  .route("/:teacher_id")
  .get(timeScheduleController.getTimeSchedule)
  .post(timeScheduleController.addTimeSchedule)
  .patch(timeScheduleController.updateTimeSchedule)
  .delete(timeScheduleController.deleteTimeSchedule);

module.exports = router; // Export the router for use in other parts of the application.
