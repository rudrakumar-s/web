const express = require("express");
const router = express.Router();
const paperController = require("./../controllers/paperController");

// This route uses the addPaper method from the paperController
router.route("/").post(paperController.addPaper);

// This route uses the getAllPapers method from the paperController
router.route("/manage/:studentId").get(paperController.getAllPapers);

router.route("/students/:paperId").get(paperController.getStudentsList);
router.route("/teacher/:teacherId").get(paperController.getPapers);
router.route("/student/:studentId").get(paperController.getPapersStudent);

// These routes use getPaper, updateStudents, and deletePaper methods from the paperController
router
  .route("/:paperId")
  .get(paperController.getPaper)
  .patch(paperController.updateStudents)
  .delete(paperController.deletePaper);

module.exports = router;
