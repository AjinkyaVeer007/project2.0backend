const mongoose = require("mongoose")

const userCompanySchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    url: {
        type: String
    }
})

module.exports = mongoose.model("Company", userCompanySchema)