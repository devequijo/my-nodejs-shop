
const router = require('express').Router()
const Items = require('../models/Item')



router.post('/test', (req,res)=>{
  console.log(req.user)
  const item = new Items({

    name:req.body.name,
    thumb: req.body.thumb,
    categories:req.body.categories,
    description: req.body.description,
    price: req.body.price,
    images: req.body.images,
    stock: req.body.stock,
    offer: req.body.offer,
    enabled: req.body.enabled,
    rating: req.body.rating,
    isRecomended: req.body.isRecomended,
    newOne: req.body.newOne,
    author: req.user,    
  })
  res.send(item.populate())
  item.save()
 
})

function checkAdmin(req,res,next){
  if (req.isAuthenticated()) {
      if (req.user.isAdmin) return next()
      else {res.send('no admin bleat')}
  }
  res.redirect('/login')
}


router.get('/admin', async (req,res)=>{

console.log(await Items.find())
  

  res.render('admin', {})
  
})


module.exports = router