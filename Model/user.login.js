const mongoose = require("mongoose")

const userLoginSchema = new mongoose.Schema({
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
    }
})

module.exports = mongoose.model("User", userLoginSchema)