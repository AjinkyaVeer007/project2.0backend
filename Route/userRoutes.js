const express = require("express");
const router = express.Router();
const connectDB = require("../Config/database");

connectDB.connect();

const {
  register,
  login,
  createcompany,
  createproject,
  editcompany,
  editproject,
  deleteproject,
  getcompany,
  getemployees,
  getprojects,
  editemployee,
  deleteemployee,
  createTask,
  getTask,
  editTask,
  projectTask,
} = require("../Controller/userController");

router.post("/register", register);

router.post("/login", login);

router.put("/updateemployeedetails/:id", editemployee);

router.delete("/deleteemployeedetails/:id", deleteemployee);

router.post("/getemployees", getemployees);

router.post("/createcompany", createcompany);

router.post("/getcompany", getcompany);

router.put("/updatecompanydetails/:id", editcompany);

router.post("/createproject", createproject);

router.post("/getprojects", getprojects);

router.put("/updateprojectdetails/:id", editproject);

router.delete("/deleteprojectdetails/:id", deleteproject);

router.post("/createtask", createTask);

router.get("/getTask/:projectId/:userId", getTask);

router.put("/updatetask/:taskId", editTask);

router.get("/projecttask/:userType/:projectId", projectTask);

module.exports = router;
