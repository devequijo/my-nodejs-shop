const Tags = require('../models/Tag')
const Cat = require('../models/Cat')
const router = require('express').Router()
const Items = require('../models/Item')
const upload = require('../middlewares/multer')
const ResizeMain = require('../resize');
const path = require('path')
const shortid = require('shortid')
function checkAdmin(req,res,next){
  if (req.isAuthenticated()) {
      if (req.user.isAdmin) return next()
      else {res.send('no admin bleat')}
  }
  res.redirect('/login')
}
router.post('/setMain', async (req, res)=>{
  const item = await Items.findOne({id:req.body.itemId})
  item.mainImage = req.body.mainImage
  item.thumb = req.body.thumb  
  await item.save() 
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
router.get('/multiUpload', async (req, res)=>{
  res.render('admin',{item:await Items.findById('5fc9965af547ae122c486329').lean(), aftherAddImage:true})
})
router.post('/multiUpload', upload.array("file", 10,), async (req, res)=>{

  if (!req.files) res.redirect(req.headers.referer)
  let upImages = []
 for(i in req.files) {await Items.findOneAndUpdate({id: req.body.itemId}, {$push: {images: req.files[i].filename}})}
  res.render('admin',{item:await Items.findOne({id:req.body.itemId}).lean(), aftherAddImage:true})
})
router.post('/imageAdd', upload.single('image'), async function (req, res) {
  
  const imagePath = path.join(__dirname, '../static/uploads');
  const fileUpload = new ResizeMain(imagePath);
  if (!req.file) {
    res.status(401).json({error: 'Please provide an image'});
  }
  const filename = await fileUpload.save(req.file.buffer);
  if (filename) {
    let item = await Items.findOne({id: req.body.itemId})
    item.mainImage = '/uploads/'+filename
    await item.save()
   
    res.redirect('/admin')
  }
});
router.post('/itemAdd', upload.array('file', 10) , async(req,res)=>{
  const item = new Items({
    id: shortid.generate(),
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
router.get('/deleteItem/:id', checkAdmin, async (req,res)=>{
  await Items.findOneAndDelete({id: req.params.id})
  res.redirect(req.headers.referer)
})
router.get('/admin', async (req,res)=>{
  let items = await Items.find().lean()
  let cat = await Cat.find().lean()
  let tags = await Tags.find().lean()
  res.render('admin', {allItems:items, categoria: cat, tags: tags })
  
})


module.exports = router