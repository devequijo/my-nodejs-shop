const mongoose = require('mongoose')
const items = require('./Item')
const User = require('./User')
const users = require('./User')
const schema = new mongoose.Schema({
    id: String,
    status: String,
    userId:{ type: mongoose.Schema.Types.Mixed, ref:User},
    productList: [{type: mongoose.Schema.Types.Mixed, ref: items}]

})
module.exports=mongoose.model('Orders', schema)