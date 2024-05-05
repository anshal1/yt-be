const { Router } = require('express')

const router = Router()
const userRoute = require('./user.route')
const videoRoute = require('./video.route')

const allRoutes = [
  { path: '/user', route: userRoute },
  { path: '/video', route: videoRoute },
]

allRoutes.forEach((routes) => {
  router.use(routes.path, routes.route)
})

module.exports = router
