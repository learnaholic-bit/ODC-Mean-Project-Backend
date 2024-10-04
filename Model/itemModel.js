const mongoose = require("mongoose");
const ModelSchema = mongoose.Schema({
    name: {type: String, unique: true},
    description: String,
    price: Number,
    photoPath: String,
    //token: String

    category: String,
    quantity: Number,
    rating: Number
    
})

module.exports = mongoose.model("Item", ModelSchema);