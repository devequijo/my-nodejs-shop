const mongoose = require('mongoose')

const Cupones = new mongoose.Schema({
    name:String,
    code: String,
    cuponType:String, 
    amount: Number,
    reference: String,
    quantity:Number
})

module.exports = mongoose.model('Cupones', Cupones)