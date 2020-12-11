const multer = require('multer');
const path = require('path');
const {nanoid} = require('nanoid')

var storage = multer.diskStorage({
  destination: path.join(__dirname, '../static/uploads'),
  filename: function (req, file, cb) {
    cb(null, nanoid().slice(0,7)+'.png')}
})

const upload = multer({
  limits: {
    fileSize: 7 * 1024 * 1024
  }, storage: storage, 
});




module.exports = upload