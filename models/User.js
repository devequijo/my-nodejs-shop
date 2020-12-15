

const userInfoSchema = new require('mongoose').Schema({
    firstName:String,
    lastName: String,
    phone: String,
    country: String,
    state: String,
    city: String,
    adress: String,
    postCode:Number,
})

const userInfo = require('mongoose').model('userInfoSchema', userInfoSchema)



const schema = new require('mongoose').Schema({
    id:String,
    login: {type:String, required:true, unique:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    lang: {type:String, default:'ES'},
    currency: {type:String, default:'EUR'},
    isAdmin: {type:Boolean, default:false},
    inCart: [{type: require('mongoose').Schema.Types.Mixed, ref: require('./Cart')}],
    created: Number,
    datos: [userInfoSchema]
})

module.exports = require('mongoose').model('Users', schema)