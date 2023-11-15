const mongoose = require("mongoose");

const userProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  startDate: {
    type: String,
    require: true,
  },
  proposeEndDate: {
    type: String,
    require: true,
  },
  priority: {
    type: String,
    require: true,
  },
  managersId: {
    type: [],
    default: null,
  },
  employeesId: {
    type: [],
    require: true,
  },
  adminId: {
    type: String,
    require: true,
  },
  progress: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Project", userProjectSchema);
