const mongoose = require('mongoose')
const schema = new mongoose.Schema({
cat:{type:String, unique:true}

})
module.exports=mongoose.model('Cat', schema)