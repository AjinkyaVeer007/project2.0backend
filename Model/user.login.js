const mongoose = require("mongoose")

const userLoginSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    userType: {
        type: String,
        require: true
    },
    adminId: {
        type: String,
    }
})

module.exports = mongoose.model("User", userLoginSchema)