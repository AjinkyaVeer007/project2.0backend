const User = require("../Model/user.login")
const Company = require("../Model/user.company")
const Project = require("../Model/user.project")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("express")

exports.register = async (req, res) => {
    try {
        // collect data from frontend
        const {name, email, password, userType, adminId} = req.body

        // validate the data
        if(!name || !email || !password || !userType){
           return res.status(401).send("All fields are mandatory")
        }

        // check user is existing or not
        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(400).send("You have already registered. Please login.")
        }

        // encrypt password
        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name, email, password: encryptedPassword, userType, adminId
        })

        const token = jwt.sign(
            {
                id: user._id,
                email
            },
            process.env.SECRET_KEY,
            {expiresIn: "2h"}
        )

        const options = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          };

        user.password = undefined

        res.status(200).cookie("token", token, options).json({
            status: true,
            user,
            message: "User Register Successfully"
        })
    } catch (error) {
        console.log(error);
        console.log("Fail to register");
    }
}

exports.login = async (req, res) => {
    try {
        // collect data from frontend
        const {email, password} = req.body

        // validate the data
        if(!email || !password){
           return res.status(401).send("All fields are mandatory")
        }

        // check user is existing or not
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).send("You need to register first for login")
        }

        //match the password & create token and send
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          {
            id: user._id,
            email,
          },
          process.env.SECRET_KEY,
          { expiresIn: "2h" }
        );
        user.password = undefined;
  
        const options = {
          expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        };
  
        res.status(200).cookie("token", token, options).json({
          status: true,
          user,
        });
  
      } else {
        res.status(400).send("Incorrect Credentails");
      }
        
    } catch (error) {
        console.log(error);
        console.log("Fail to login");
    }
}

exports.createcompany = async (req, res) => {
    try {
        // collect data frontend frontend
        const {adminId, name, url} = req.body

        // validation for frontend
        if(!adminId && !name){
            return res.status(400).send("Company name is mandatory")
        }

        // check wheather user has already created company or not
        const existingUser = await Company.findOne({adminId})

        if(existingUser){
            return res.status(400).send("You have already created a company") 
        }

        // store data in database
        const companyData = await Company.create({
            adminId, name, url
        })

        res.status(200).json({
            status: true,
            message: "Company Created Successfully",
            data: companyData
        })


    } catch (error) {
        console.log(error);
        console.log("Fail to create company");
    }
}

exports.editcompany = async (req, res) => {
    try {
       await Company.findByIdAndUpdate(req.params.id, req.body);
       res.status(200).json({
        status: true,
        message: "Company details updated successfully"
    })
    } catch (error) {
        console.log(error);
        console.log("Fail to update company details");
    }
}

exports.createproject = async (req, res) => {
    try {
            // get data from frontend
    const {name, startDate, proposeEndDate, priority, managerIds, employeeIds, adminId} = req.body

    // validation for frontend
    if(!name, !startDate, !proposeEndDate, !priority, !employeeIds, !adminId){
        res.status(401).send("All Fields Are Mandatory")
    }

    const projectData = await Project.create({
        name, startDate, proposeEndDate, priority, managerIds, employeeIds, adminId
    })

    res.status(200).json({
        status : true,
        message: "Project Created Successfully",
        data : projectData
    })
    } catch (error) {
        console.log(error);
        console.log("Fail to create project");
    }
}

exports.editproject = async (req, res) => {
    try {
       await Project.findByIdAndUpdate(req.params.id, req.body);
       res.status(200).json({
        status: true,
        message: "Project details updated successfully"
    })
    } catch (error) {
        console.log(error);
        console.log("Fail to update project details");
    }
}

exports.deleteproject = async (req, res) => {
    try {
       await Project.findByIdAndDelete(req.params.id);
       res.status(200).json({
        status: true,
        message: "Project details deleted successfully"
    })
    } catch (error) {
        console.log(error);
        console.log("Fail to delete project details");
    }
}