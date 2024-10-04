const mongoose = require("mongoose");
const ModelSchema = mongoose.Schema({
    username: {type:String, unique: true},
    email: {type: String, unique: true, email: true},
    password: String,
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    photoPath: String,
    //token: String 
    
})

module.exports = mongoose.model("User", ModelSchema);