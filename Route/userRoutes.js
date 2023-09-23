const express = require("express")
const router = express.Router()
const connectDB = require("../Config/database")

connectDB.connect()

const {register, login, createcompany, createproject} = require("../Controller/userController")

router.post("/register", register)

router.post("/login", login)

router.post("/createcompany", createcompany)

router.post("/createproject", createproject)

module.exports = router;