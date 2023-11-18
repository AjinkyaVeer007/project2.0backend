const User = require("../Model/user.login");
const Company = require("../Model/user.company");
const Project = require("../Model/user.project");
const Tasks = require("../Model/user.task");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("express");

exports.register = async (req, res) => {
  try {
    // collect data from frontend
    const {
      name,
      email,
      password,
      userType,
      adminId,
      defaultPassword,
      isPasswordChange,
    } = req.body;

    // validate the data
    if (!name || !email || !password || !userType) {
      return res.status(401).send("All fields are mandatory");
    }

    // check user is existing or not
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).send("You have already registered. Please login.");
    }

    // encrypt password
    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: encryptedPassword,
      userType,
      adminId,
      defaultPassword,
      isPasswordChange,
    });

    const token = jwt.sign(
      {
        id: user._id,
        email,
      },
      process.env.SECRET_KEY,
      { expiresIn: "2h" }
    );

    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    };

    user.password = undefined;

    res.status(200).cookie("token", token, options).json({
      status: true,
      user,
      message: "User Register Successfully",
    });
  } catch (error) {
    console.log(error);
    console.log("Fail to register");
  }
};

exports.login = async (req, res) => {
  try {
    // collect data from frontend
    const { email, password } = req.body;

    // validate the data
    if (!email || !password) {
      return res.status(401).send("All fields are mandatory");
    }

    // check user is existing or not
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("You need to register first for login");
    }

    //match the password & create token and send

    if (
      user &&
      (user.isPasswordChange
        ? await bcrypt.compare(password, user.password)
        : password === user.defaultPassword)
    ) {
      const token = jwt.sign(
        {
          id: user._id,
          email,
        },
        process.env.SECRET_KEY,
        { expiresIn: "2h" }
      );
      user.password = undefined;

      const companyData = await Company.findOne({
        adminId: `${user.adminId || user._id}`,
      });

      const managers = await User.find({
        adminId: `${user.adminId || user._id}`,
        userType: "Manager",
      });
      const employees = await User.find({
        adminId: `${user.adminId || user._id}`,
        userType: "Employee",
      });

      let projects;
      if (user.userType === "Admin") {
        projects = await Project.find({
          adminId: `${user._id}`,
        });
      } else if (user.userType === "Manager") {
        projects = await Project.find({
          managersId: `${user._id}`,
        });
      } else {
        projects = await Project.find({
          employeesId: `${user._id}`,
        });
      }

      const options = {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      };

      if (user.userType === "Admin") {
        res.status(200).cookie("token", token, options).json({
          status: true,
          user,
          companyData,
          managers,
          employees,
          projects,
        });
      } else {
        res.status(200).cookie("token", token, options).json({
          status: true,
          user,
          companyData,
          projects,
        });
      }
    } else {
      res.status(400).send("Incorrect Credentails");
    }
  } catch (error) {
    console.log(error);
    console.log("Fail to login");
  }
};

exports.editemployee = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      status: true,
      message: "Employee details updated successfully",
    });
  } catch (error) {
    console.log(error);
    console.log("Fail to update employee details");
  }
};

exports.deleteemployee = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: true,
      message: "Employee details deleted successfully",
    });
  } catch (error) {
    console.log(error);
    console.log("Fail to delete employee details");
  }
};

exports.getemployees = async (req, res) => {
  try {
    const { adminId } = req.body;

    const managers = await User.find({ adminId, userType: "Manager" });
    const employees = await User.find({ adminId, userType: "Employee" });

    if (employees.length || managers.length) {
      res.status(200).json({
        status: true,
        users: {
          managers,
          employees,
        },
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Employee data not found",
      });
    }
  } catch (error) {
    console.log(error);
    console.log("Fail to get employee details");
  }
};

exports.createcompany = async (req, res) => {
  try {
    // collect data frontend frontend
    const { adminId, name, url } = req.body;

    // validation for frontend
    if (!adminId && !name) {
      return res.status(400).send("Company name is mandatory");
    }

    // check wheather user has already created company or not
    const existingUser = await Company.findOne({ adminId });

    if (existingUser) {
      return res.status(400).send("You have already created a company");
    }

    // store data in database
    const companyData = await Company.create({
      adminId,
      name,
      url,
    });

    res.status(200).json({
      status: true,
      message: "Company Created Successfully",
      data: companyData,
    });
  } catch (error) {
    console.log(error);
    console.log("Fail to create company");
  }
};

exports.getcompany = async (req, res) => {
  try {
    const { adminId } = req.body;
    const companyData = await Company.findOne({ adminId });

    if (companyData) {
      res.status(200).json({
        status: true,
        companyData,
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Company data not found",
        companyData,
      });
    }
  } catch (error) {
    console.log(error);
    console.log("Fail to get company details");
  }
};

exports.editcompany = async (req, res) => {
  try {
    await Company.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      status: true,
      message: "Company details updated successfully",
    });
  } catch (error) {
    console.log(error);
    console.log("Fail to update company details");
  }
};

exports.createproject = async (req, res) => {
  try {
    // get data from frontend
    const {
      name,
      startDate,
      proposeEndDate,
      priority,
      managersId,
      employeesId,
      adminId,
    } = req.body;

    // validation for frontend
    if (
      !name ||
      !startDate ||
      !proposeEndDate ||
      !priority ||
      !employeesId.length ||
      !adminId
    ) {
      return res.status(401).send("Must be fill mandatory fields");
    }

    const projectData = await Project.create({
      name,
      startDate,
      proposeEndDate,
      priority,
      managersId,
      employeesId,
      adminId,
    });

    res.status(200).json({
      status: true,
      message: "Project Created Successfully",
      data: projectData,
    });
  } catch (error) {
    console.log(error);
    console.log("Fail to create project");
  }
};

exports.getprojects = async (req, res) => {
  try {
    const { userId, userType } = req.body;
    let projectData;
    if (userType === "Admin") {
      projectData = await Project.find({ adminId: userId })
        .populate({
          path: "managersId",
          model: User,
        })
        .populate({
          path: "employeesId",
          model: User,
        });
    } else if (userType === "Manager") {
      projectData = await Project.find({ managersId: userId })
        .populate({
          path: "managersId",
          model: User,
        })
        .populate({
          path: "employeesId",
          model: User,
        });
    } else {
      projectData = await Project.find({ employeesId: userId })
        .populate({
          path: "managersId",
          model: User,
        })
        .populate({
          path: "employeesId",
          model: User,
        });
    }

    if (projectData) {
      const formattedProjectData = projectData.map((project) => {
        return {
          _id: project._id,
          name: project.name,
          startDate: project.startDate,
          proposeEndDate: project.proposeEndDate,
          priority: project.priority,
          managers: project.managersId.map((filteredManager) => ({
            _id: filteredManager._id,
            name: filteredManager.name,
            email: filteredManager.email,
          })),
          employees: project.employeesId.map((filteredEmployee) => ({
            _id: filteredEmployee._id,
            name: filteredEmployee.name,
            email: filteredEmployee.email,
          })),
          adminId: project.adminId,
          progress: project.progress,
          __v: project.__v,
        };
      });

      res.status(200).json({
        status: true,
        projectData: formattedProjectData,
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Project data not found",
        projectData,
      });
    }
  } catch (error) {
    console.log(error);
    console.log("Fail to get project details");
  }
};

exports.editproject = async (req, res) => {
  try {
    await Project.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      status: true,
      message: "Project details updated successfully",
    });
  } catch (error) {
    console.log(error);
    console.log("Fail to update project details");
  }
};

exports.deleteproject = async (req, res) => {
  try {
    await Tasks.deleteMany({ projectId: req.params.id });
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: true,
      message: "Project details deleted successfully",
    });
  } catch (error) {
    console.log(error);
    console.log("Fail to delete project details");
  }
};

exports.createTask = async (req, res) => {
  try {
    const { userName, userId, adminId, projectId, userType, taskList } =
      req.body;
    if (!taskList.length) {
      return res.status(401).send("Please assign task to user");
    }

    let existingTaskData;
    if (userType === "Admin") {
      existingTaskData = await Tasks.findOne({ adminId, projectId });
    } else {
      existingTaskData = await Tasks.findOne({ userId, projectId });
    }

    if (existingTaskData) {
      existingTaskData.taskList = existingTaskData.taskList.concat(taskList);
      await existingTaskData.save();
    } else {
      await Tasks.create({
        userName,
        userId,
        adminId,
        projectId,
        taskList,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Task assign successfully",
    });
  } catch (error) {
    console.log(error);
    console.log("Fail to create project");
  }
};

exports.getTask = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const taskList = await Tasks.findOne(
      { userId, projectId },
      { adminId: 0, userId: 0, projectId: 0 }
    );

    if (taskList) {
      return res.status(200).json({
        status: true,
        taskList,
      });
    } else {
      return res.status(200).json({
        status: false,
        message: "No task found",
        taskList: [],
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: "No task found",
    });
  }
};

exports.editTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { isCompleted, commit } = req.body;

    await Tasks.findOneAndUpdate(
      { "taskList._id": taskId },
      {
        $set: {
          "taskList.$.isCompleted": isCompleted,
          "taskList.$.commit": commit,
        },
      },
      { new: true }
    );

    res.status(200).json({
      status: true,
      message: "Task update successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: "Fail to update task",
    });
  }
};

exports.projectTask = async (req, res) => {
  try {
    const { projectId, userType } = req.params;

    let projectTask = await Project.findOne(
      { _id: projectId },
      { _id: 0, managersId: 1, employeesId: 1 }
    )
      .populate({
        path: "managersId",
        model: User,
        select: "_id name email",
      })
      .populate({
        path: "employeesId",
        model: User,
        select: "_id name email",
      });

    const managerIds = projectTask.managersId.map((manager) => manager._id);
    const employeeIds = projectTask.employeesId.map((employee) => employee._id);

    const tasksForManagers = await Tasks.find({
      userId: { $in: managerIds },
      projectId: projectId,
    });
    const tasksForEmployees = await Tasks.find(
      {
        userId: { $in: employeeIds },
        projectId: projectId,
      },
      { userName: 0, adminId: 0, projectId: 0 }
    );

    if (userType === "Employee") {
      return res.status(200).json({
        status: true,
        projectTask: {
          managers: [],
          employees: projectTask.employeesId.map((employee) => ({
            id: employee._id,
            name: employee.name,
            email: employee.email,
            taskList: tasksForEmployees.filter(
              (task) => task.userId.toString() === employee._id.toString()
            ),
          })),
        },
      });
    } else {
      return res.status(200).json({
        status: true,
        projectTask: {
          managers: projectTask.managersId.map((manager) => ({
            id: manager._id,
            name: manager.name,
            email: manager.email,
            taskList: tasksForManagers.filter(
              (task) => task.userId.toString() === manager._id.toString()
            ),
          })),
          employees: projectTask.employeesId.map((employee) => ({
            id: employee._id,
            name: employee.name,
            email: employee.email,
            taskList: tasksForEmployees.filter(
              (task) => task.userId.toString() === employee._id.toString()
            ),
          })),
        },
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: "No data found",
    });
  }
};
