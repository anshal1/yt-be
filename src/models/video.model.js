const { Schema, model } = require('mongoose')
const ApiError = require('../../utils/ApiError')

const Video = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    video: {
      type: Map,
    },
    views: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
    },
    title: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

Video.pre('save', async function (next) {
  const videoData = this
  if (!videoData?.title) {
    throw new ApiError('Please Provide A Title', 400)
  }
  let slug = videoData?.title?.split(' ').join('-')
  let findVideoithSlug = await this.model('videos').findOne({ slug })
  let index = 0
  while (findVideoithSlug) {
    slug = `${videoData?.title?.split(' ').join('-')}-${index}`
    findVideoithSlug = await this.model('videos').findOne({ slug })
    index++
  }
  videoData.slug = slug
  next()
})

module.exports = model('videos', Video)
