const {body} = require("express-validator");
const userModel = require("../Model/userModel");
const {isUniqueUserModel} = require("../Utils/isUnique");
// exports.userValidation = (req, res, next) => {}
//check other validation techniques and libraries later
// const expressValidator = require("express-validator");
    


const isUniqueEmail = async (value) => {
    await isUniqueUserModel({email: value});
}

const isUniqueUsername = async (value) => {
    // console.log({username: value})
    await isUniqueUserModel({username: value});
}





const userValidation = [
    body("username")
        .isLength({min: 3}).withMessage("Username must be at least 3 characters long")
        .custom(isUniqueUsername).withMessage("Username already exists"),
    body("email")
        .isEmail().withMessage("Email must be valid")
        .custom(isUniqueEmail).withMessage("Email already exists"),
    body("password")
        .isLength({min: 6}).withMessage("Password must be at least 6 characters long")
        .isStrongPassword().withMessage("Password must be strong"),
    body("role").isIn(["user",""]).withMessage("Register Role must be either 'user'"),
    // body("photoPath").notEmpty().withMessage("User photoPath is required"),
]




exports.userValidationFunction = ()=>{
    // some logic if required
    return userValidation
};


