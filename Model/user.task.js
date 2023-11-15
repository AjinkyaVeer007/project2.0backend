const mongoose = require("mongoose");

const usertaskSchema = new mongoose.Schema({
  userName: {
    require: true,
    type: String,
  },
  userId: {
    require: true,
    type: String,
  },
  adminId: {
    require: true,
    type: String,
  },
  projectId: {
    require: true,
    type: String,
  },
  taskList: {
    type: [
      {
        id: String,
        task: String,
        isCompleted: {
          type: Boolean,
          default: false,
        },
        commit: {
          type: String,
          default: null,
        },
      },
    ],
    require: true,
  },
});

module.exports = mongoose.model("Task", usertaskSchema);
