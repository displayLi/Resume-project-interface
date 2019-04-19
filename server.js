const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const path = require('path')
const app = express()

// users
const users = require('./routes/api/users')
const profiles = require('./routes/api/profiles')
const posts = require('./routes/api/posted')

// connect MongoDB
mongoose.connect('mongodb://localhost:27017/interface')
    .then(success => console.log('MongoDB is connected...'))
    .catch(err => console.log(err))


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// server loading 静态资源
app.use(express.static(path.join(__dirname, 'public')))

// Access-Control-Allow-Origin
app.use((req, res, next) => {
    res.header({ 'Access-Control-Allow-Origin': '*' });
    res.header({ 'Access-Control-Allow-Headers': 'Content-Type' });
    res.header({ 'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE' });
    next()
})

// passport 初始化
app.use(passport.initialize());

// passport config
require('./config/possport')(passport)

// user router
app.use('/user', users)

// profile
app.use('/profile', profiles)

// posted
app.use('/posts', posts)

//  server
const port = 8085

app.listen(port, (req, res) => {
    console.log(`Server is running! address and  http://localhost:${port}`)
})