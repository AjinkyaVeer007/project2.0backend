const express = require("express")
const router = express.Router()
const connectDB = require("../Config/database")

connectDB.connect()

const {register, login, createcompany} = require("../Controller/userController")

router.post("/register", register)

router.post("/login", login)

router.post("/createcompany", createcompany)

module.exports = router;