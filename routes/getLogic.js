const Cats = require('../models/Cat')
const Items = require('../models/Item')
const Tags = require('../models/Tag')
const Cupon = require('../models/Cupon')
const Users = require('../models/User')
const path = require('path')
var fs = require('fs');
const {nanoid} = require('nanoid')

async function createCupon(req,res,next){ 
    const cupon = new Cupon({
        code:req.body.code? req.body.code : nanoid().slice(0,7),
        name:req.body.name,
        cuponType:req.body.cuponType,
        amount:req.body.amount,
        quantity:(req.body.quantity)?req.body.quantity:1
    })
    await cupon.save().then(data=> next(data))
}

async function applyCupon(req, res, next){
    const cupon = await Cupon.findOne({code:req.body.code})
    if (cupon && cupon.quantity>0) {
        req.cupon=cupon
        await Users.findOneAndUpdate({id: req.user.id},{cupon:cupon._id})
}
 next()   
}



function checkAuth(req,res,next){
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkAdmin(req,res,next){
    // if (req.isAuthenticated()) {
    //     if (req.user.isAdmin) return next()
    //     else {res.send('no admin bleat')}
    // }
    // res.redirect('/login')
return next()  
}

  async function getCommonData(req,res,next) {
  
    let items = await Items.find().lean()
    var totalPrice = 0
    if (req.user) {
        var inCart = req.user.inCart
       
        inCart.map(el=>totalPrice+=el.finalPrice*el.cantidad/50)
        console.log(totalPrice)
    }
    let showcat = await getCats()
    let showtag = await getTags()
    let isAdmin = (req.user) ? req.user.isAdmin : null
    let username = (req.user) ? req.user.login : null
    let cupon = (req.user) ? req.user.cupon? await Cupon.findById(req.user.cupon).lean() : null : null

    if(cupon){
        var discount = 0
        switch (cupon.cuponType){
            case "once":
                discount = totalPrice*cupon.amount/100
                break;
            case "giftCard":
                discount = totalPrice-cupon.amount
                break;
        }
    }

     var commonData = {
     'price':'inCart.articulo.price',
     'title':'α✴Ω MagicTea.Shop ☥  || Compartimos magia contigo',
     'allItems':items.reverse(),
     'inCart':inCart,
     'cats': showcat,
     'tags':showtag,
     'isAdmin':isAdmin, 
     'user':username,
     'totalPrice': (req.user)? totalPrice.toFixed(2): null,
     'cupon': cupon,
     'discount':(cupon)? discount.toFixed(2) : 0,
     'total': (cupon)? (totalPrice-discount).toFixed(2) : totalPrice.toFixed(2)
        }

     if(req.customGet){     
         var keys = Object.keys(req.customGet)
         for( let key in keys){
             commonData[keys[key]]=req.customGet[keys[key]]       
         }
     }
     return commonData
    }


async function getCats(){
    cats=[]
    
        let todas = await Cats.find()
        for( let i = 0; i< todas.length; i++)
            {
                let item = await Items.find({"categories" : todas[i].cat}, {"categories.$" : 1})
                if (item.length>0) {
                    cats.push(todas[i].cat)
                    }
                }


            return cats 
    }

async function deleteImg(req, res, next){
    fs.unlink(path.join(__dirname,'../static/uploads/')+req.params.id, (err) => {
        console.log(req.params.id)
        if (err) {
          console.error(err)
          return
        }})
   await Items.findOneAndUpdate({'images':req.params.id}, {$pull : { images : req.params.id}})
   next()
}
async function getTags(){
var tags=[]
    let todos = await Tags.find()
    for( let i = 0; i< todos.length; i++)
        {
            let item = await Items.find({"tags" : todos[i].tag}, {"tags.$" : 1})
            if (item.length>0) {
                tags.push(todos[i].tag)
                }
            }


        return tags

}


async function setMain(req,res, next) {
    const item = await Items.findOne({id:req.body.itemId})
    item.mainImage = req.body.mainImage
    item.thumb = req.body.thumb  
    await item.save() 
    next()
}
async function handeUploaded(req,res,next){
    if (!req.files) res.redirect(req.headers.referer)
    let upImages = []
   for(i in req.files) { 
 
     await Items.findOneAndUpdate({id: req.body.itemId}, {$push: {images: req.files[i].filename}}).then(data => console.log('f'+data))
    }
    next()
}



module.exports = {getCats, applyCupon, checkAdmin, setMain, handeUploaded, getCommonData, checkAuth, deleteImg, createCupon}