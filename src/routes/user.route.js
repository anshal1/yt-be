const { Router } = require('express')
const router = Router()
const { userControlles } = require('../controller/index')
const getUserById = require('../middlewares/getUser')

router
  .route('/')
  .get(getUserById(), userControlles.getUser)
  .post(userControlles.CreateUser)

router.route('/login').post(userControlles.Login)

module.exports = router
