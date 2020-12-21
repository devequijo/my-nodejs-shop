const mongoose = require('mongoose')
const User = require('./User')
const Cat = require('./Cat')
const Tag = require('./Tag')

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
    inStock: Boolean,
    newOne: Boolean,
    isRecomended: Boolean,
    thumb: String,
    mainImage: String,
    images: {type: mongoose.Schema.Types.Mixed, ref: mongoose.model('images', imagesSchema)},
    categories : {type: mongoose.Schema.Types.Mixed, ref : Cat}, 
    tags : {type: mongoose.Schema.Types.Mixed, ref : Tag},
    // author: {type:mongoose.Schema.Types.Mixed, ref: User}   
})


module.exports = mongoose.model('Item', itemSchema)