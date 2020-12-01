
const {app, start, mainRoutes, passport, adminRoutes} = require('./init')
const flash = require('express-flash')
app.use(require('cookie-parser')());
const session = require('express-session')
const passportConfig = require('./passport-config')
start()


app.use(flash())
passportConfig(passport)

app.use(session({secret:'240736ee492d3c34b6044dc34e727652', saveUninitialized:false, resave:false, cookie:{httpOnly:true}}))
app.use(passport.initialize())
app.use(passport.session())
app.use(mainRoutes)
app.use(adminRoutes)


app.get('*', function(req, res){
    res.status(404).redirect(req.headers.referer)
  });



