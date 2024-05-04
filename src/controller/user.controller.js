const CatchErr = require('../../utils/CatchErr')
const hashText = require('../../utils/Hash')
const { userModel } = require('../models/index')
const jwt = require('jsonwebtoken')

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
  // eslint-disable-next-line no-undef
  const token = jwt.sign({ token: user?._id }, process.env.SECRET)
  res.status(201).json({ token })
})

module.exports = {
  getUser,
  CreateUser,
}
