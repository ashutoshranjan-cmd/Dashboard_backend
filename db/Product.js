const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    name:String,
    price:String,
    category:String,
    userId:String,
    company:String,
    filePath:String
});

module.exports = mongoose.model("products",productSchema)