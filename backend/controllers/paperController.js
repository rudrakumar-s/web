const { mongoose } = require("mongoose");
const Paper = require("./../models/Paper");
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");


// Retrieves a list of course assigned to a specific teacher.
const getPapers = asyncHandler(async (req, res) => {
  if (!req?.params?.teacherId) {  // Check if teacher ID is provided in request parameters
    return res.status(400).json({ message: "Teacher ID Missing" });
  }

  // Find course where the provided ID matches the teacher's ID
  const papers = await Paper.find({
    teacher: req.params.teacherId,
  })
    .select("-students")
    .exec();
  if (!papers) {
    return res.status(404).json({
      message: `No Paper(s) found`,
    });
  }
  res.json(papers);
});

// Retrieves a list of course for a specific student.
const getPapersStudent = asyncHandler(async (req, res) => {
  // Check if student ID is provided in request parameters
  if (!req?.params?.studentId) {
    return res.status(400).json({ message: "Student ID Missing" });
  }
  // Aggregation to find and return courses related to the student
  const papers = await Paper.aggregate([
    {
      $lookup: {
        from: "teachers",
        localField: "teacher",
        foreignField: "_id",
        as: "teacher",
      },
    },
    {
      $unwind: "$teacher",
    },
    {
      $project: {
        students: {
          $in: [new mongoose.Types.ObjectId(req.params.studentId), "$students"],
        },
        semester: 1,
        year: 1,
        paper: 1,
        "teacher.name": 1,
      },
    },
    {
      $match: { students: true },
    },
  ]);
  if (!papers) {
    return res.status(404).json({
      message: `No Paper(s) found`,
    });
  }
  res.json(papers);
});

// Retrieves all papers.
const getAllPapers = asyncHandler(async (req, res) => {
  if (!req?.params?.studentId) {
    return res.status(400).json({ message: "Student ID Missing" });
  }

  // Similar aggregation as above to get all courses
  const papers = await Paper.aggregate([
    {
      $lookup: {
        from: "teachers",
        localField: "teacher",
        foreignField: "_id",
        as: "teacher",
      },
    },
    {
      $unwind: "$teacher",
    },
    {
      $project: {
        semester: 1,
        year: 1,
        paper: 1,
        "teacher.name": 1,
        students: 1,
        department: 1,
        joined: {
          $in: [new mongoose.Types.ObjectId(req.params.studentId), "$students"],
        },
      },
    },
  ]);
  if (!papers) {
    return res.status(404).json({
      message: `No Paper(s) found`,
    });
  }
  res.json(papers);
});

// Retrieves a list of students for a specific courses.
const getStudentsList = asyncHandler(async (req, res) => {
  if (!req?.params?.paperId) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Params Missing" });
  }

  // Retrieves a specific paper by ID.
  const students = await Paper.findById(req.params.paperId)
    .select("students")
    .populate({ path: "students", select: "name" })
    .exec();
  if (!students?.students) {
    return res.status(400).json({ message: "No Students Found" });
  }
  res.json(students.students);
});

// Get Paper
const getPaper = asyncHandler(async (req, res) => {
  if (!req?.params?.paperId) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Params Missing" });
  }
  const paper = await Paper.findOne({
    _id: req.params.paperId,
  })
    .populate({ path: "teacher", select: "name" })
    .populate({ path: "students", select: "name" })
    .exec();
  if (!paper) {
    return res.status(404).json({
      message: `No Paper(s) found`,
    });
  }
  res.json(paper);
});

// Add Paper
const addPaper = asyncHandler(async (req, res) => {
  const { department, semester, year, paper, students, teacher } = req.body;

  // Confirm Data
  if (!department || !paper || !semester || !year || !students || !teacher) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Fields Missing" });
  }

  // Check for Duplicates
  const duplicate = await Paper.findOne({
    department: req.body.department,
    paper: req.body.paper,
    students: req.body.students,
    teacher: req.body.teacher,
  })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Paper already exists" });
  }

  const PaperObj = {
    department,
    semester,
    paper,
    year,
    students,
    teacher,
  };

  // Create and Store New teacher
  const record = await Paper.create(PaperObj);

  if (record) {
    res.status(201).json({
      message: `New Paper ${req.body.paper} added `,
    });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

//  Delete Paper
const deletePaper = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Paper ID required" });
  }

  const record = await Paper.findById(id).exec();

  if (!record) {
    return res.status(404).json({ message: "Paper not found" });
  }

  await record.deleteOne();

  res.json({ message: `${paper} deleted` });
});


// ############################################################################ Student update fucntion with Email Function ##########################################################################
const updateStudents = asyncHandler(async (req, res) => {
  const { id, students } = req.body;

  if (!id || !students) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const paper = await Paper.findById(id).exec();

  if (!paper) {
    return res.status(404).json({ message: "Paper doesn't exist" });
  }

  const previousStudents = new Set(paper.students.map(String));
  const updatedStudents = new Set(students.map(String));

  const newStudents = students.filter(student => !previousStudents.has(student));
  const droppedStudents = [...previousStudents].filter(student => !updatedStudents.has(student));

  if (newStudents.length > 0) {
    await sendEmailToStudents(newStudents, 'registered', paper.paper);
  }

  if (droppedStudents.length > 0) {
    await sendEmailToStudents(droppedStudents, 'dropped', paper.paper);
  }

  paper.students = students;

  const updated = await paper.save();

  if (updated) {
    res.json({ message: "Paper updated successfully" });
  } else {
    res.status(400).json({ message: "Failed to update paper" });
  }
});

// Helper function to send email to students
const sendEmailToStudents = async (studentIds, action, courseName) => {
  for (const studentId of studentIds) {
    const student = await Student.findById(studentId);

    if (student) {
      const subject = `Course ${action} notification`;
      const text = `You have ${action} the course: ${courseName}.`;

      // Define email sending logic here
      // Example using Nodemailer
      const transporter = nodemailer.createTransport({
        // SMTP configuration
      });
      const mailOptions = {
        from: 'your-email@example.com',
        to: student.email,
        subject: subject,
        text: text,
      };

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
}
};


module.exports = {
  addPaper,
  getAllPapers,
  getPapers,
  getPapersStudent,
  getStudentsList,
  getPaper,
  updateStudents,
  deletePaper,
};
