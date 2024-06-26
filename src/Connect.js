const mongoose = require('mongoose')
const DB = process.env.DB

function Connect() {
  mongoose.connect(DB).then(() => {
    console.log('Database Connected')
  })
}

module.exports = Connect
