const Users = require('./models/User')
const bcrypt = require('bcrypt')
const localStrategy = require('passport-local').Strategy
function initialize (passport){
    const autenticateUser = async (login, password, done)=>{
        // await Users.findOne({login:login}).then(user=>{
        //     if(!user) return done(null, false,{'message':'Usuario no encontrado!'})
        //     bcrypt.compare(password, user.password).then((err,res)=>{
        //         if (!res) return done(null, false,{'message':'La contraseña introducida, no es correcta!'})
        //         return done(null, user)
        //    })
        //    })
        const user = await Users.findOne({login:login})
        if (!user) return done(null, false, {'message':'Usuario no encontrado'})
        if(!await bcrypt.compare(password, user.password)){            
             return done(null,false,{message:'La contraseña introducida, no es correcta'})
            }

        return done(null, user)
    }

    passport.use(new localStrategy({usernameField:'login'},autenticateUser))
    passport.serializeUser((user,done)=>{
        done(null, user.id);
    })
    passport.deserializeUser((id,done)=>{
        Users.findOne({id:id}).then(User=>{
            done(null, User);
           
          });
    })
}

module.exports = initialize