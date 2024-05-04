const mongoose = require('mongoose')
// eslint-disable-next-line no-undef
const DB = process.env.DB

function Connect() {
  mongoose.connect(DB).then(() => {
    console.log('Database Connected')
  })
}

module.exports = Connect
