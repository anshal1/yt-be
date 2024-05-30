const ApiError = require('../../utils/ApiError')
const CatchErr = require('../../utils/CatchErr')
const { videoModel } = require('../models/index')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)
const path = require('path')
const fs = require('fs')
const { Dropbox } = require('dropbox')
const TOKEN = process.env.DBX

const dbx = new Dropbox({
  accessToken: TOKEN,
  accessTokenExpiresAt: new Date('2050-01-01'),
})

const resolutions = [
  { resolution: '640x360', bitrate: '800k' }, // low resolution
  { resolution: '1280x720', bitrate: '1000k' }, // medium resolution
  { resolution: '1920x1080', bitrate: '3000k' }, // high resolution
]

const uploadVideo = CatchErr(async (req, res) => {
  const user = req.user
  const { title } = req.body
  if (!req.file) {
    throw new ApiError('Please Provide A Video', 400)
  }
  // storing all the video paths with corresponding resolution
  const allVideoUrls = new Map()
  const hostedUrls = new Map()
  // looping over all resolution and encoding the videos
  resolutions.forEach(({ resolution, bitrate }) => {
    const name = `${req?.file?.filename}${resolution}${user?._id}.mp4`
    // output path of the encoded video
    const outputFilePath = path.join(__dirname, `../videos/`, name)
    allVideoUrls.set(resolution, `${process.env.URL}/${name}`)

    ffmpeg(req?.file?.path)
      .outputOptions(['-vf', `scale=${resolution}`, '-b:v', bitrate])
      .output(outputFilePath)
      .on('end', async () => {
        console.log(`Transcoding of ${resolution} finished`)
        // on completion of encoding uploading the video to dropbox
        try {
          const fileContent = fs.readFileSync(outputFilePath)
          console.log('Started Uploading')
          const response = await dbx.filesUpload({
            path: `/Apps/Ap-YT/${name}`,
            contents: fileContent,
          })
          const sharedLinkResponse =
            await dbx.sharingCreateSharedLinkWithSettings({
              path: `/Apps/Ap-YT/${name}`,
            })
          const sharedLink = sharedLinkResponse.result.url.replace(
            'dl=0',
            'raw=1',
          )
          hostedUrls.set(resolution, sharedLink)
          // updating the document
          const query = {
            [`video.${resolution}`]: `${process.env.URL}/${response.result.name}`,
          }
          await videoModel.findOneAndUpdate(query, {
            $set: { dropboxData: response.result, sharedUrl: hostedUrls },
          })
          fs.unlinkSync(path.join(__dirname, `../videos/`, name))
          console.log(`Video: ${resolution} Uploaded`)
        } catch (error) {
          console.log(error)
          throw new ApiError(error?.message, 500)
        }
      })
      .on('error', (err) => {
        throw new ApiError(err?.message, 500)
      })
      .run()
  })
  const data = {
    user: user?._id,
    video: allVideoUrls,
    slug: '',
    title,
  }
  const video = await videoModel.create(data)
  res.status(201).json({ message: 'Video Upoaded Successfully', video })
})

const getAllVideos = CatchErr(async (req, res) => {
  const { page = 1, limit = 15 } = req.query
  const videos = await videoModel
    .find({})
    .limit(+limit)
    .skip(+limit * (+page - 1))
    .populate('user')
  res.status(200).json({ videos })
})

const getVideoBySlug = CatchErr(async (req, res) => {
  const { slug } = req.params
  const video = await videoModel.findOne({ slug }).populate('user')
  if (!video) {
    throw new ApiError('Video Not Found', 404)
  }
  res.status(200).json({ video })
})

const updateViews = CatchErr(async (req, res) => {
  const { slug } = req.params
  const videoExists = await videoModel.findById(slug)
  if (!videoExists) {
    throw new ApiError('Video Not Found', 404)
  }
  const views = videoExists?.views
  const updatedVideo = await videoModel.findByIdAndUpdate(
    slug,
    { $set: { views: views + 1 } },
    { new: true },
  )
  res.status(200).json(updatedVideo)
})

const deleteVideo = CatchErr(async (req, res) => {
  const user = req.user
  const { slug } = req.params
  const videoExists = await videoModel.findById(slug)
  if (!videoExists) {
    throw new ApiError('Video Not Found', 404)
  }
  const correctUser = user?._id?.toString() === videoExists?.user?.toString()
  if (!correctUser) {
    throw new ApiError('Unauthorzed Action', 401)
  }
  const values = videoExists?.video?.values()
  for (let file of values) {
    const filename = file?.replace(`${process.env.URL}/`, '')
    const fileExist = fs.existsSync(
      path.join(__dirname, '../videos/', filename),
    )
    if (fileExist) {
      fs.unlinkSync(path.join(__dirname, '../videos/', filename))
    }
  }
  const deleteDocument = await videoModel.findByIdAndDelete(slug)
  res.status(200).json(deleteDocument)
})

module.exports = {
  uploadVideo,
  getAllVideos,
  getVideoBySlug,
  updateViews,
  deleteVideo,
}
