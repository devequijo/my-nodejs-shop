const router = require('express').Router()
const Users = require('../models/User')
const bcrypt = require('bcrypt')
const shortid = require('shortid')
const passport = require('passport')
const User = require('../models/User')
const Items = require('../models/Item')
const Cart = require('../models/Cart')

const {body, validationResult} = require('express-validator')
const { findOne } = require('../models/User')


function checkAuth(req,res,next){
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

router.post('/removeItem', checkAuth, async (req, res)=>{
    const cart = await Users.findOneAndUpdate({'inCart.id' : req.body.id}, { $pull: { inCart: { id: req.body.id } } })
    res.redirect(req.headers.referer)
})


router.post('/cantidad', async (req, res)=>{
    
const test = await Users.findOne({'inCart.id': req.body.id})
  const cart = await Users.findOneAndUpdate({'inCart.id' : 'jd1KLROua'},  { 'inCart.$.cantidad': req.body.cantidad })
    console.log(test)
    res.json(test)
})


router.post('/addToCart', checkAuth, async (req,res)=>{
 
    try {
 
        let posibleCart = await Cart.findOne({usuario: req.user.login})
        if (posibleCart){
            posibleCart.updateOne({ $push: { articulo: await Items.findOne({_id: req.body.id}).lean() } })
        }
      else {
        let cart = new Cart({
            usuario : req.user.login,
            articulo : await Items.findOne({_id: req.body.id}).lean(),
            cantidad : req.body.cantidad
        })
        console.log(cart)
        await cart.save()

    }
        res.redirect(req.headers.referer)
    }
    catch (e) {console.log(e)}

})
router.get('/addToCart/:id/:cantidad', checkAuth, async (req,res)=>{
   if (!isNaN(parseInt(req.params.cantidad))){
    const user = await Users.findById(req.user._id)
    const item = await Items.findById(req.params.id)
    user.inCart.push({
        id: shortid.generate(),
        articulo: item,
        cantidad: req.params.cantidad,
        finalPrice: (item.price-(item.price*(item.offer/100)))
   } )

    await user.save()
    res.redirect(req.headers.referer)} else {res.json({'message':'fuck u'})
}})

router.get('/', async (req,res)=>{
    let items = await Items.find().lean()
    if (req.user) {
        var inCart = req.user.inCart
    }

    let isAdmin = (req.user) ? req.user.isAdmin : null
    let username = (req.user) ? req.user.login : null
    res.type('html').render('index', 
    {'price':'inCart.articulo.price',
     'title':'α✴Ω MagicTea.Shop ☥  || Compartimos magia contigo',
     'allItems':items,
     'inCart':inCart,
     'isAdmin':isAdmin, 
     'user':username}, )}, )

router.get('/view/:id', async (req,res)=>{
    let items = await Items.find().lean()
    if (req.user) {
        var inCart = await Cart.find({'usuario.login': req.user.login}).populate().lean()
    
    }
    item = await Items.findOne({_id:req.params.id}).lean()
    let username = (req.user) ? req.user.login : null
    res.render('view', {'price':'inCart.articulo.price', 'title':'α✴Ω MagicTea.Shop  || Compartimos magia contigo'+item.name,'item':item,'inCart':inCart, 'user':username})
})    
router.get('/login', (req,res)=>{ res.type('html').render('login')})
router.post('/login', passport.authenticate('local',{successRedirect:'/', failureRedirect:'/login', failureMessage:'Lol'}), (req,res)=>{ 
    res.render('index')
    console.log(failureMessage)
})
router.get('/register',  (req,res)=>{ console.log(res.body)
    res.type('html').render('register')})
router.post('/register',
[
    body('email').isEmail()
                 .normalizeEmail(),
    body('password').isLength({min:6})
                    .trim()                  

], async(req,res)=>{
    try{

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
      

        const hashPass = await bcrypt.hash(req.body.password,10)     
         await Users.find({login: req.body.login}).then((found)=>{
            console.log(found)
            if (found.length > 0) return res.status(400).json({'message':'user exists'})
            else {
            let user = new User({
                'id': shortid.generate(),
                'email':req.body.email,
                'login': req.body.login,
                'password': hashPass,
                })
                user.save().then(()=>{res.redirect('/?created=' + 'true',)})
                
            }
        })

        }
        
    
    catch(e){}
})
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
router.get('setCurrency', checkAuth, async (req, res)=>{
    
})
module.exports = router