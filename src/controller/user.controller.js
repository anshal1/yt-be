const ApiError = require('../../utils/ApiError')
const CatchErr = require('../../utils/CatchErr')
const hashText = require('../../utils/Hash')
const { userModel } = require('../models/index')
const jwt = require('jsonwebtoken')
const bc = require('bcrypt')

const getUser = CatchErr((req, res) => {
  res.status(200).json(req.user)
})

const CreateUser = CatchErr(async (req, res) => {
  const { body } = req
  const hashedPass = await hashText(body?.password)
  const data = {
    ...body,
    password: hashedPass,
  }
  const user = await userModel.create(data)
  const token = jwt.sign({ token: user?._id }, process.env.SECRET)
  res.status(201).json({ token })
})

const Login = CatchErr(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new ApiError('Email And Password Are Required', 400)
  }
  const user = await userModel.findOne({ email })
  if (!user) {
    throw new ApiError('User Not Found', 404)
  }
  const comparePass = bc.compare(password, user?.password)
  if (!comparePass) {
    throw new ApiError('Invalid Email Or Password', 401)
  }
  const token = jwt.sign({ token: user?._id }, process.env.SECRET)
  res.status(200).json({ token })
})

module.exports = {
  getUser,
  CreateUser,
  Login,
}
