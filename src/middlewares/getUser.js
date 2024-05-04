const ApiError = require('../../utils/ApiError')
const CatchErr = require('../../utils/CatchErr')
const { userModel } = require('../models/index')
const jwt = require('jsonwebtoken')

const getUserById = (showPassword = false) =>
  CatchErr(async (req, res, next) => {
    const id = req.header('token')
    if (!id) {
      throw new ApiError('Please Login Or Register To Continue', 400)
    }
    // eslint-disable-next-line no-undef
    const userId = jwt.decode(id, process.env.SECRET)
    if (!userId) {
      throw new ApiError('Unaouthorized Action')
    }
    const user = await userModel
      .findById(userId?.token)
      .select(showPassword ? '' : '-password')
    if (!user) {
      throw new ApiError('User Not Found', 404)
    }
    req.user = user
    next()
  })

module.exports = getUserById
