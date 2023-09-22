const User = require("../Model/user.login")
const Company = require("../Model/user.company")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("express")

exports.register = async (req, res) => {
    try {
        // collect data from frontend
        const {email, password, userType} = req.body

        // validate the data
        if(!email || !password || !userType){
           return res.status(401).send("All fields are mandatory")
        }

        // check user is existing or not
        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(400).send("User is already exist")
        }

        // encrypt password
        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email, password: encryptedPassword, userType
        })

        const token = jwt.sign(
            {
                id: user._id,
                email
            },
            process.env.SECRET_KEY,
            {expiresIn: "2h"}
        )

        user.token = token
        user.password = undefined

        res.status(200).json({
            data : user,
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
        const {email, password, userType} = req.body

        // validate the data
        if(!email || !password || !userType){
           return res.status(401).send("All fields are mandatory")
        }

        // check user is existing or not
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).send("User is not registered")
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
        user.token = token;
  
        const options = {
          expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        };
  
        res.status(200).cookie("token", token, options).json({
          success: true,
          token,
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
        const {userId, name, url} = req.body

        // validation for frontend
        if(!userId && !name){
            return res.status(400).send("Company name is mandatory")
        }

        // check wheather user has already created company or not
        const existingUser = await Company.findOne({userId})

        if(existingUser){
            return res.status(400).send("You have already created a company") 
        }

        // store data in database
        const companyData = await Company.create({
            userId, name, url
        })

        res.status(200).json({
            status: true,
            data: companyData
        })


    } catch (error) {
        console.log(error);
        console.log("Fail to create company");
    }
}