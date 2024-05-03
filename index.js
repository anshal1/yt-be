const express = require('express')
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000
const app = express()
const allRoutes = require('./src/routes/index')
const Connect = require('./src/Connect')

app.use(express.json())

app.use('/', allRoutes)

app.use((err, req, res, next) => {
  res.status(err?.status).json({ error: err?.message, status: err?.status })
  console.log('An Error Has Occured')
  next()
})

app.listen(PORT, () => {
  console.log(`App Running On Port ${PORT}`)
  Connect()
})
