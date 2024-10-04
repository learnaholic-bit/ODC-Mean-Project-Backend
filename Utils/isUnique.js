//for future use, maybe better have exists and return the object if it does
const itemModel = require("../Model/itemModel");
const userModel = require("../Model/userModel");


exports.isUniqueItemModel = async (object) => {
    let search = await itemModel.findOne(object);
    if (search) {
        // return false;
        throw new Error("item already exists");
    }
    return true;
}


exports.isUniqueUserModel = async (object) => {
    const user = await userModel.findOne(object);
    if (user) {
        // return false;
        throw new Error("user already exists");
    }
    return true;
};


