const bc = require('bcrypt')
const ApiError = require('./ApiError')

const hashText = async (text) => {
  if (!text) throw new ApiError('Please Provide A Text To Hash', 400)
  const salt = await bc.genSalt(10)
  const hash = await bc.hash(text, salt)
  return hash
}

module.exports = hashText
