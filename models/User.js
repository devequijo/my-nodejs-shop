const schema = new require('mongoose').Schema({
    id:String,
    login: {type:String, required:true, unique:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    lang: {type:String, default:'ES'},
    currency: {type:String, default:'EUR'},
    isAdmin: {type:Boolean, default:false},
    inCart: [{type: require('mongoose').Schema.Types.Mixed, ref: require('./Cart')}],
    created: Number
})

module.exports = require('mongoose').model('Users', schema)