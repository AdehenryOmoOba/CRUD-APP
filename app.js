require('./db')
require('./models/employee-model')
const express = require('express');
const ejs = require('ejs')
const server = express()
const path = require('path');
const employeeController = require('./emp-controller');
const { urlencoded } = require('body-parser');


server.set('view engine', 'ejs')
server.use(express.static('./public'))
server.use(express.json())
server.use(urlencoded({extended:true}))
server.use('/', employeeController)




server.listen(5500, () =>{
    console.log('Server is running on port 5500...')
})

