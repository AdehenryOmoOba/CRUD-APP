// Load enviroment variables
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}


// Requirements
require('./db')
require('./models/employee-model')
const employeeControl    = require('./controllers/controller')
const express            = require('express');
const ejs                = require('ejs')
const server             = express();
const { urlencoded }     = require('body-parser');
const passport           = require('passport')
const session            = require('express-session');
const mongoose           = require('mongoose');
const initializePassport = require('./passport');
initializePassport(passport)



// Middlewares
server.set('view engine', 'ejs')
server.use('/public', express.static('public'))
server.use(express.json())
server.use(urlencoded({extended:true}))
server.use(session({secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false}));
server.use(passport.initialize())
server.use(passport.session())
server.use('/', employeeControl)




// Server
const PORT = process.env.PORT || 5500
server.listen(PORT, () =>{
    console.log('Server is running on port 5500...')
})

