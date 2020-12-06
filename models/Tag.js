const mongoose = require('mongoose')
const schema = new mongoose.Schema({
tag:{type:String, unique:true}

})
module.exports=mongoose.model('Tag', schema)