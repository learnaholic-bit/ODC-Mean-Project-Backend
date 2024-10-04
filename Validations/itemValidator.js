
const {body} = require("express-validator");
const itemModel = require("../Model/itemModel");
const {isUniqueItemModel} = require("../Utils/isUnique");


/*
name: {type: String, unique: true},
    description: String,
    price: Number,
    photoPath: String,
    //token: String

    category: String,
    quantity: Number,
    rating: Number
*/


const isUniqueName = async (value) => {
    await isUniqueItemModel({name: value});
}



const itemValidator = [
    body("name").notEmpty().withMessage("Item name is required")
        .custom(isUniqueName).withMessage("Item name already exists"),
    body("description").notEmpty().withMessage("Item description is required"),
    body("price").notEmpty().withMessage("Item price is required"),
    body("photoPath").notEmpty().withMessage("Item photoPath is required"), // added in the upload middleware
    body("category").notEmpty().withMessage("Item category is required"),
    body("quantity").notEmpty().withMessage("Item quantity is required"),

]



exports.itemValidatorFunction = ()=>{
    // some logic if required
    return itemValidator;
};