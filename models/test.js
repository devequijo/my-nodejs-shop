const mongoose = require('mongoose')
const schema = new mongoose.Schema({
lol:String,
Lola:Number,

})
module.exports=mongoose.model('algo', schema)