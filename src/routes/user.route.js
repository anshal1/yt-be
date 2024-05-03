const { Router } = require('express')
const router = Router()
const { userControlles } = require('../controller/index')
const getUserById = require('../middlewares/getUser')

router
  .route('/')
  .get(getUserById(), userControlles.getUser)
  .post(userControlles.CreateUser)

module.exports = router
