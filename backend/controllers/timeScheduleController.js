const TimeSchedule = require("./../models/TimeSchedule");
const asyncHandler = require("express-async-handler");

// Get TimeSchedule for each Teacher
const getTimeSchedule = async (req, res) => {
  if (!req?.params?.teacher_id) {
    return res.status(400).json({ message: "ID Required" }); // checking fileds
  }
  const timeSchedule = await TimeSchedule.findOne({
    teacher: req.params.teacher_id,
  }).exec();
  if (!timeSchedule) {
    return res.status(404).json({
      message: `Time Schedule not found`,
    });
  }
  res.json(timeSchedule);
};

// Add TimeSchedule
const addTimeSchedule = asyncHandler(async (req, res) => {
  const { teacher, schedule } = req.body;

  // Confirm Data
  if (!teacher || !schedule) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Fields Missing" });
  }

  // Check for Duplicates
  const duplicate = await TimeSchedule.findOne({
    teacher: teacher,
  })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Time Schedule already exists" });
  }

  const TimeScheduleObj = {
    teacher,
    schedule,
  };

  // Create and Store New Time Schedule
  const record = await TimeSchedule.create(TimeScheduleObj);

  if (record) {
    res.status(201).json({
      message: `Time Schedule added successfully`,
    });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// Update TimeSchedule
const updateTimeSchedule = asyncHandler(async (req, res) => {
  const { teacher, schedule } = req.body;

  // Confirm Data
  if (!teacher || !schedule) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find Record
  const record = await TimeSchedule.findOne({ teacher: teacher }).exec();

  if (!record) {
    return res.status(404).json({ message: "Time Schedule doesn't exist" });
  }

  record.schedule = schedule;

  const save = await record.save();
  if (save) {
    res.json({ message: `Time Schedule Updated` });
  } else {
    res.json({ message: "Save Failed" });
  }
});

//Delete TimeSchedule

const deleteTimeSchedule = asyncHandler(async (req, res) => {
  if (!req?.params?.teacher_id) {
    return res.status(400).json({ message: "ID Required" });
  }

  const record = await TimeSchedule.findById(req.params.teacher_id).exec();
  if (!record) {
    return res.status(404).json({ message: "Time Schedule not found" });
  }
  await record.deleteOne();
  res.json({ message: `Time Schedule deleted` });
});

module.exports = {
  getTimeSchedule,
  addTimeSchedule,
  updateTimeSchedule,
  deleteTimeSchedule,
};
