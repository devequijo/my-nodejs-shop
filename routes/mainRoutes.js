const router = require('express').Router()
const Users = require('../models/User')
const bcrypt = require('bcrypt')
const nanoid = require('nanoid')
const passport = require('passport')
const User = require('../models/User')
const Cats = require('../models/Cat')
const Items = require('../models/Item')
const Cart = require('../models/Cart')
const {body, validationResult} = require('express-validator')
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
  const cart = await Users.findOneAndUpdate({'inCart.id' : req.body.id},  { 'inCart.$.cantidad': req.body.cantidad }).then()

a = await Users.find({"inCart.id": req.body.id}, {'inCart.$': 1});
    res.json(a)
})
router.post('/addToCart', checkAuth, async (req,res)=>{
 
    try {
 
        let posibleCart = await Cart.findOne({usuario: req.user.login})
        if (posibleCart){
            posibleCart.updateOne({ $push: { articulo: await Items.findOne({id: req.body.id}).lean() } })
        }
      else {
        let cart = new Cart({
            usuario : req.user.login,
            articulo : await Items.findOne({id: req.body.id}).lean(),
            cantidad : req.body.cantidad
        })
     
        await cart.save()

    }
        res.redirect(req.headers.referer)
    }
    catch (e) {console.log(e)}

})
router.get('/addToCart/:id/:cantidad', checkAuth, async (req,res)=>{
   if (!isNaN(parseInt(req.params.cantidad))){
    const user = await Users.findOne({id:req.user.id})
    const item = await Items.findOne({id:req.params.id})
    user.inCart.push({
        id: nanoid().slice(0,7),
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
    let cats = await Cats.find().lean()
    let isAdmin = (req.user) ? req.user.isAdmin : null
    let username = (req.user) ? req.user.login : null
    res.type('html').render('index', 
    {'price':'inCart.articulo.price',
     'title':'α✴Ω MagicTea.Shop ☥  || Compartimos magia contigo',
     'allItems':items,
     'inCart':inCart,
     'cats':cats,
     'isAdmin':isAdmin, 
     'user':username}, )}, )

router.get('/view/:id', async (req,res)=>{
    if (req.user) {
        var inCart = req.user.inCart
    }
    allItems = await Items.find()
    item = await Items.findOne({id:req.params.id}).lean()
    let username = (req.user) ? req.user.login : null
    let usuario = (req.user) ? req.user.id : null
    if (!item) return res.send('i')
    res.render('view', {'price':'inCart.articulo.price','allItems':allItems, 'title':'α✴Ω MagicTea.Shop  || Compartimos magia contigo'+item.name,'item':item,'inCart':inCart, 'usuario':usuario, 'user':username})
})    
router.get('/login', (req,res)=>{ 
    console.log(nanoid().slice(0,7))
    res.type('html').render('login')})
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
                'id': nanoid().slice(0,7),
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