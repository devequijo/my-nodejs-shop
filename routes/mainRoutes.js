const {getCommonData, checkAuth} = require('./getLogic')

const router = require('express').Router()
const Users = require('../models/User')
const bcrypt = require('bcrypt')
const {nanoid} = require('nanoid')
const passport = require('passport')
const User = require('../models/User')
const Items = require('../models/Item')
const {body, validationResult} = require('express-validator')
const flash = require('express-flash')


router.get('/', async (req,res)=>{  console.log('rere')
    res.type('html').render('index', await getCommonData(req) )})





router.get('/cart', checkAuth, async (req, res)=>{
    // let data = getCommonData()
    // ;(await data).inCart.reduce(data=>{})
    res.render('cart', await getCommonData(req))
})

router.get('*/all', async (req,res)=>{
    res.json({ 
        user:req.isAuthenticated?req.user:null,
        items:await Items.find(),

    })
})

router.get('/cat/t?:id', async (req, res)=>{
    items = await Items.find({"tags" : req.params.id}).lean()
    if (items.length>0) req.customGet={'allItems':items}  
    res.render('index', await getCommonData(req))
    console.log(req.params.id)
})

router.get('/cat/:id', async (req, res)=>{
    items = await Items.find({"categories" : req.params.id}).lean()
    if (items.length>0) req.customGet={'allItems':items}  
    res.render('index', await getCommonData(req))
})


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
    if (!isNaN(parseInt(req.body.cantidad))){
        const user = await Users.findOne({id:req.user.id})
        const item = await Items.findOne({id:req.body.id})
        user.inCart.push({
            id: nanoid().slice(0,7),
            articulo: item,
            cantidad: req.body.cantidad,
            finalPrice: (item.price-(item.price*(item.offer/100)))
       } )
    
        await user.save()
        res.redirect('#')} else {res.json({'message':'fuck u'})
    }
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


router.get('/view/:id', async (req,res)=>{
    if (req.user) {
        var inCart = req.user.inCart
    }
    allItems = await Items.find().lean()
    item = await Items.findOne({id:req.params.id}).lean()
    let username = (req.user) ? req.user.login : null
    let usuario = (req.user) ? req.user.id : null
    if (!item) return res.send('i')
    res.render('view', {'price':'inCart.articulo.price','allItems':allItems, 'title':'α✴Ω MagicTea.Shop  || Compartimos magia contigo'+item.name,'item':item,'inCart':inCart, 'usuario':usuario, 'user':username})
})    
router.get('/login', (req,res)=>{ 
    res.type('html').render('login')})
router.post('/login', passport.authenticate('local',{successRedirect:'/', failureRedirect:'/login', failureMessage:'Lol', failureFlash:true}), (req,res)=>{ 
    console.log(flash)  
    res.render('index', {message: 'lol'})

})
router.get('/register',  (req,res)=>{ 
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
            if (found.length > 0) return res.status(400).json({'message':'user exists'})
            else {
            let user = new User({
                'id': nanoid().slice(0,7),
                'email':req.body.email,
                'login': req.body.login,
                'password': hashPass,
                'created': Date.now()
                })
                user.save().then(()=>{res.redirect('/login?created=' + 'true',)})
                
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