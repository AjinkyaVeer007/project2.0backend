const express = require("express")
const router = express.Router()
const connectDB = require("../Config/database")

connectDB.connect()

const {register, login, createcompany, createproject, editcompany, editproject, deleteproject} = require("../Controller/userController")

router.post("/register", register)

router.post("/login", login)

router.post("/createcompany", createcompany)

router.post("/createproject", createproject)

router.put("/updatecompanydetails/:id", editcompany)

router.put("/updateprojectdetails/:id", editproject)

router.delete("/deleteprojectdetails/:id", deleteproject)

module.exports = router;