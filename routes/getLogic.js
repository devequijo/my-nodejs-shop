const Cats = require('../models/Cat')
const Items = require('../models/Item')

function checkAuth(req,res,next){
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkAdmin(req,res,next){
    if (req.isAuthenticated()) {
        if (req.user.isAdmin) return next()
        else {res.send('no admin bleat')}
    }
    res.redirect('/login')
  }

  async function getCommonData(req,res,next) {
  
    let items = await Items.find().lean()
    if (req.user) {
        var inCart = req.user.inCart
    }
    let showcat = await getCats()
    let isAdmin = (req.user) ? req.user.isAdmin : null
    let username = (req.user) ? req.user.login : null
     


     var commonData = {
     'price':'inCart.articulo.price',
     'title':'α✴Ω MagicTea.Shop ☥  || Compartimos magia contigo',
     'allItems':items.reverse(),
     'inCart':inCart,
     'cats': showcat,
     'isAdmin':isAdmin, 
     'user':username}

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



module.exports = {getCats, checkAdmin, setMain, handeUploaded, getCommonData, checkAuth}