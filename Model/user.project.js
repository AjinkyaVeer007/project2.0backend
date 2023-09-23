const mongoose = require("mongoose")

const userProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    startDate: {
        type: String,
        require: true
    },
    proposeEndDate: {
        type: String,
        require: true
    },
    priority: {
        type: String,
        require: true
    },
    managerIds: {
        type: [],
        default: null
    },
    employeeIds: {
        type: [],
        require: true
    },
    adminId: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model("Project", userProjectSchema)