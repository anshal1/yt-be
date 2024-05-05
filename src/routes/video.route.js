const { Router } = require('express')

const router = Router()
const multer = require('multer')

const { videoControlles } = require('../controller/index')
const getUserById = require('../middlewares/getUser')

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  },
})

const upload = multer({ storage })

router
  .route('/')
  .post(getUserById(), upload.single('video'), videoControlles.uploadVideo)
  .get(videoControlles.getAllVideos)

router.route('/:slug').get(videoControlles.getVideoBySlug)

module.exports = router
