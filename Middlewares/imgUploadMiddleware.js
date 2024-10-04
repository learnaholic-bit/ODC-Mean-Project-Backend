const multer = require('multer')
const path = require('path')
const uploadFolder = 'uploads/'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder)
    },

    filename: function (req, file, cb) {
        // console.log(file)
        const filename = Date.now() + '-' + file.originalname
        //set the value for the validator and to store in db
        console.log(file)
        if (file){
            req.body.photoPath = path.join(uploadFolder, filename)
        }
        // req.body.photoPath = path.join(uploadFolder, filename)
        //for complex image validation create a validator middleware
        //below is a simple validation
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, filename)
        }
        else {
            cb(new Error('Only jpg and png files are allowed'))
        }
    }
})

const upload = multer({ storage: storage });
module.exports = upload