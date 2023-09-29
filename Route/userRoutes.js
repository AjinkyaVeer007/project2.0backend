const express = require("express")
const router = express.Router()
const connectDB = require("../Config/database")

connectDB.connect()

const {register, login, createcompany, createproject, editcompany, editproject, deleteproject, getcompany, getemployees, getprojects, editemployee, deleteemployee} = require("../Controller/userController")

router.post("/register", register)

router.post("/login", login)

router.put("/updateemployeedetails/:id", editemployee)

router.delete("/deleteemployeedetails/:id", deleteemployee)

router.post("/getemployees", getemployees)

router.post("/createcompany", createcompany)

router.post("/getcompany", getcompany)

router.put("/updatecompanydetails/:id", editcompany)

router.post("/createproject", createproject)

router.post("/getprojects", getprojects)

router.put("/updateprojectdetails/:id", editproject)

router.delete("/deleteprojectdetails/:id", deleteproject)

module.exports = router;