const mongoose = require("mongoose");

// Schema to record attendance details of students for a specific paper
const attendanceSchema = new mongoose.Schema(
  {
    paper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paper",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    hour: {
      type: Number,
      required: true,
    },
    attendance: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Student", // reference to student model
        },
        present: {
          type: Boolean,
          default: "true",  // Automatically add timestamps
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
