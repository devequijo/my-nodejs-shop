const mongoose = require('mongoose')
const User = require('./User')
const categorySchema = new mongoose.Schema({
    cat : String
})


const imagesSchema = new mongoose.Schema({
    img : String
})

const itemSchema = new mongoose.Schema({
    name : {type: String, required:true, unique:true},
    id: String,
    description : String,
    stock: Number,
    price: Number,
    offer: {type: Number, default: null},
    rating: Number,
    enabled: Boolean,
    newOne: Boolean,
    isRecomended: Boolean,
    thumb: String,
    mainImage: String,
    images: {type: mongoose.Schema.Types.Mixed, ref: mongoose.model('images', imagesSchema)},
    categories : {type: mongoose.Schema.Types.Mixed, ref : mongoose.model('categories', categorySchema)}, 
    // author: {type:mongoose.Schema.Types.Mixed, ref: User}   
})


module.exports = mongoose.model('Item', itemSchema)