const express = require("express");
const router = express.Router();
const internalController = require("./../controllers/internalController");


// get result of every course
router.route("/student/:studentId").get(internalController.getInternalStudent);

// Routes for a specific paper
router
  .route("/:paper")
  .get(internalController.getInternal)
  .post(internalController.addInternal)
  .patch(internalController.updateInternal)
  .delete(internalController.deleteInternal);

module.exports = router;
