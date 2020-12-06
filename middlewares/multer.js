const multer = require('multer');
const path = require('path');
const shortid = require('shortid')

var storage = multer.diskStorage({
  destination: path.join(__dirname, '../static/uploads'),
  filename: function (req, file, cb) {
    cb(null, shortid.generate())}
})

const upload = multer({
  limits: {
    fileSize: 6 * 1024 * 1024
  }, storage: storage, 
});




module.exports = upload