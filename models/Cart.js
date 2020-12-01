const mongoose = require('mongoose')
const User = require('./User')
const Item = require('./Item')
const schema = new mongoose.Schema({
    articulo : {type: mongoose.Schema.Types.Mixed, ref: Item},
    cantidad:  Number,
    finalPrice : Number,
    owner: String
})  

module.exports=mongoose.model('Cart', schema)