const {checkAdmin, setMain, handeUploaded} = require('./getLogic')
const Tags = require('../models/Tag')
const Cat = require('../models/Cat')
const router = require('express').Router()
const Items = require('../models/Item')
const upload = require('../middlewares/multer')
const path = require('path')
const {nanoid} = require('nanoid')

router.post('/setMain', checkAdmin, setMain, async (req, res)=>{
  res.redirect('/admin')
})

router.post('/addCat', async (req, res)=>{

  if(req.body.newCategoria){
    const cat = new Cat({
      cat: req.body.newCategoria
    })
    await cat.save()
    res.json(cat)
  }
  if(req.body.newTag) {
    const tag = new Tags({
      tag: req.body.newTag
    })
    await tag.save()
    res.json(tag)
  }
})

router.post('/multiUpload', upload.array("file", 10), handeUploaded, async (req, res)=>{
  res.render('admin',{item:await Items.findOne({id:req.body.itemId}).lean(), aftherAddImage:true})
})

router.post('/itemAdd', upload.array('file', 10) , async(req,res)=>{
  const item = new Items({
    id: await nanoid().slice(0,7),
    name:req.body.name,
    thumb: req.body.thumb,
    tags: req.body.tag,
    categories:req.body.cat,
    description: req.body.description,
    price: req.body.price,
    images: [],
    mainImage: '',
    stock: req.body.stock,
    offer: req.body.offer,
    enabled: req.body.enabled,
    rating: req.body.rating,
    isRecomended: req.body.isRecomended,
    newOne: req.body.newOne,
    author: req.user,    
  })
 
 await item.save()

//  if (req.files) {
//   for(i in req.files) {await Items.findOneAndUpdate({_id: }, {$push: {images: req.files[i].filename}})}
// }
 

let items = await Items.find().lean()

res.render('admin', {allItems:items})

})
router.get('/deleteItem/:id', checkAdmin,  async (req,res)=>{
  await Items.findOneAndDelete({id: req.params.id})
  res.redirect(req.headers.referer)
})
router.get('/admin', checkAdmin, async (req,res)=>{
  let items = await Items.find().lean()
  let cat = await Cat.find().lean()
  let tags = await Tags.find().lean()
  if (req.user) {
    var inCart = req.user.inCart
}
  res.render('admin', {allItems:items,inCart:inCart, categoria: cat, tags: tags })
  
})


module.exports = router