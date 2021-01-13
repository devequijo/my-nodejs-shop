const flash = require('express-flash')
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const config = require('./config')
const passport = require('passport')
const expHbs = require('express-handlebars')
const mainRoutes = require('./routes/mainRoutes')
const adminRoutes = require('./routes/adminRoutes')
const Users = require('./models/User')
const Item = require('./models/Item')
const hbs = expHbs.create({
    defaultLayout:'main',
    extname:'hbs', 
    helpers: require('./hbsHelpers.js')
})
app.use(flash())
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(express.static('static'));
app.use('/view/', express.static('static') )
app.use('/addImages/', express.static('static') )
app.use('/cat/', express.static('static') )
app.use('/update/', express.static('static') )

app.use(express.urlencoded({extended:true}))
app.use(express.json())


const start = () =>{
    mongoose.connect(config.databaseURI, {useNewUrlParser:true,autoIndex:false,useFindAndModify:false, useCreateIndex:true, useUnifiedTopology:true}).then(()=>{
        app.listen(3000, ()=> console.log('Listening'))
    })
    
}



module.exports = {app, config, Users, start, mainRoutes,passport, adminRoutes, Item}