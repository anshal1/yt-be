const mongoose = require('mongoose')

function Connect() {
  mongoose.connect('mongodb://127.0.0.1:27017/yt').then(() => {
    console.log('Database Connected')
  })
}

module.exports = Connect
