require('dotenv').config({ path: './.env' })
const express = require('express')
const PORT = process.env.PORT || 5000
const app = express()
const allRoutes = require('./src/routes/index')
const Connect = require('./src/Connect')
const path = require('path')
const cors = require('cors')

app.use(
  cors({
    origin: '*',
  }),
)

app.use(express.json())

app.use('/', allRoutes)
app.use('/public', express.static(path.join(__dirname, './src/videos')))

app.use((err, req, res, next) => {
  res
    .status(err?.status || 500)
    .json({ error: err?.message, status: err?.status })
  console.log(err)
  next()
})

app.listen(PORT, () => {
  console.log(`App Running On Port ${PORT}`)
  Connect()
})
