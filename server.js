const express = require('express')
const app = express()
const path = require('path')
const multer = require('multer')
const sharp = require('sharp')

const port = 3000

app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// server config for accepting image files from client
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    console.log(file)
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
    cb(null, true)
  } else {
    console(null, false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
})

// file upload route
// Sharp lib config to generate thumbnail
app.post('/uploads', upload.single('image'), (req, res, next) => {
  try {
    sharp(req.file.path).resize(200,200).toFile(
      'uploads/' + 'thumbnails-' + req.file.originalname, (err, resizeImage) => {
        if (err) {
          console.log(err)
        } else {
          console.log(resizeImage)
        }
      }
    )
    return  res.status(201).json({
      message: 'File upload successful'
    })
  } catch (error){
    console.error(error)
  }
})

app.listen(port, () => console.log(`app listening on port ${port}`))