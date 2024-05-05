const ApiError = require('../../utils/ApiError')
const CatchErr = require('../../utils/CatchErr')
const { videoModel } = require('../models/index')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)
const path = require('path')

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
  const allVideoUrls = new Map()
  resolutions.forEach(({ resolution, bitrate }) => {
    const outputFilePath = path.join(
      __dirname,
      `../videos/`,
      `${req?.file?.filename}_${resolution}_${user?._id}.mp4`,
    )
    allVideoUrls.set(
      resolution,
      `${process.env.URL}/${req?.file?.filename}_${resolution}_${user?._id}.mp4`,
    )

    ffmpeg(req?.file?.path)
      .outputOptions(['-vf', `scale=${resolution}`, '-b:v', bitrate])
      .output(outputFilePath)
      .on('end', () => {
        console.log(`Transcoding of ${resolution} finished`)
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

module.exports = {
  uploadVideo,
  getAllVideos,
  getVideoBySlug,
}
