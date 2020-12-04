
const router = require('express').Router()
const Items = require('../models/Item')
const upload = require('../middlewares/multer')
const ResizeMain = require('../resize');
const path = require('path')

router.post('/multiUpload', upload.array("file", 10,), async (req, res)=>{
  if (!req.files) res.redirect(req.headers.referer)
  let upImages = []
 for(i in req.files) {await Items.findOneAndUpdate({_id: req.body.itemId}, {$push: {images: req.files[i].filename}})}
  res.redirect(req.headers.referer)
})

router.post('/imageAdd', upload.single('image'), async function (req, res) {
  
  const imagePath = path.join(__dirname, '../static/uploads');
  const fileUpload = new ResizeMain(imagePath);
  if (!req.file) {
    res.status(401).json({error: 'Please provide an image'});
  }
  const filename = await fileUpload.save(req.file.buffer);
  if (filename) {
    let item = await Items.findOne({_id: req.body.itemId})
    item.mainImage = '/uploads/'+filename
    await item.save()
    console.log(filename)
    res.redirect('/admin')
  }
});

router.post('/itemAdd', upload.array('file', 10) ,(req,res)=>{
  console.log(req.user)
  const item = new Items({

    name:req.body.name,
    thumb: req.body.thumb,
    categories:req.body.categories,
    description: req.body.description,
    price: req.body.price,
    images: req.body.images,
    mainImage: req.body.mainImage,
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

router.get('/deleteItem/:id', checkAdmin, async (req,res)=>{
  await Items.findOneAndDelete({_id: req.params.id})
  console.log(req.params.id)
  res.redirect(req.headers.referer)
})

router.get('/admin', async (req,res)=>{
  let items = await Items.find().lean()
  

  res.render('admin', {allItems:items})
  
})


module.exports = router