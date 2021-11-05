// Load enviroment variables
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}


// Requirements
require('./db')
require('./models/employee-model')
const express            = require('express');
const ejs                = require('ejs')
const server             = express();
const { urlencoded }     = require('body-parser');
const passport           = require('passport')
const LocalStrategy      = require('passport-local');
const session            = require('express-session');
const mongoose           = require('mongoose');
const path               = require('path/posix');
const Employee           = require('./models/employee-model')
const Admin              = require('./models/admin-model')
const bcrypt             = require('bcrypt');



// Middlewares
server.set('view engine', 'ejs')
server.use('/public', express.static('public'))
server.use(express.json())
server.use(urlencoded({extended:true}))
server.use(session({secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false}));
server.use(passport.initialize())
server.use(passport.session())


// PassportJS
passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser((id, done) => Admin.findById(id, (err, user) => done(err, user)))


passport.use(new LocalStrategy(function (username, password, done) {
    // Check username in database
   Admin.findOne({username: username}, function (err, user) {
     if(err){ return done(err) }
     if(!user){ return done(null, false, {msg: 'Username is incorrect!'}) }
   // Check password correctness
    bcrypt.compare(password, user.password, function (err, res) {
        if(err){ return done(err) }
        if(res === false || res === undefined) { return done(null, false, {msg: 'Password is incorrect!'})}

        return done(null, user)
    })
     

   })

    
}))

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()){
    return next();
  } else {
      res.redirect('/')
  }
}
const isLoggedOut = (req, res, next) => {
  if (!req.isAuthenticated()){
    return next();
  } else {
      res.redirect('/list')
  }
}


// Routess
server.get('/', isLoggedOut ,(req, res) => {
    const loginError = req.query.error;
    const loggedOut = req.query.logout;
    const registered = req.query.registered ;
    const invalidLogin = 'Login Unsuccessful'
    res.render('login', {error: loginError, loggedOutMessage: loggedOut,invalidLogin, registered})
})

server.post('/login', passport.authenticate('local', {successRedirect: '/list?login=true', failureRedirect: '/?error=true'}))

server.get('/register', (req, res) => {
    
    res.render('register' )
})

server.post('/register', async (req, res) => {
 
    
    try {
        const {email,username,password} = req.body;
        const hashedPassord = await bcrypt.hash(password, 10);

        const admin = new Admin();
    
        admin.email = email;
        admin.username = username;
        admin.password = hashedPassord;

        admin.save();

        res.redirect('/?registered=true')

    } catch  {
        res.redirect('/register')
    }

   
})


server.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/?logout=true')
})

server.get('/insert', (req, res) => {
    res.render('insert')
})


server.post('/login', (req, res) => {

    res.redirect('/list')
})


// Insert/Update data into database..........

server.post('/', (req, res) => {
    if (!req.body._id){
        insertEmployee(req, res)    
    } else {
        updateEmployee(req, res)
    }
    
})

function insertEmployee(req, res) {
    let employee = new Employee();
    
    employee.fullName = req.body.fullName
    employee.email = req.body.email
    employee.mobile = req.body.mobile
    employee.city = req.body.city

    employee.save((err, item) => {
        if(!err){
          res.redirect('/list')
        } else{  
                console.log(`Error adding employee data into database:` + err) 
        }
    });
}

 function updateEmployee(req, res){
  Employee.findOneAndUpdate({_id: req.body._id}, req.body, {new: true},  (err, item) => {
     res.redirect('/list')
  })
}


// Fetch data from database..........

server.get('/list', isLoggedIn ,(req, res) => {
    Employee.find({}, function (err, items)  {
        const login = req.query.login
        const userName = req.user.username
        res.render('list', { employeeList: items, username: userName,login})

    })
        
})

// Edit employee data......

server.get('/:id', (req, res) => {
    Employee.findById(req.params.id,  function (err, item)  {
        if(!err){
            res.render('edit', { employeeList: item})
        } else {
            return
        }
       
    })
        
  
})

server.get('/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, item) => {
        res.redirect('/list')
    })  
})



// Server
const PORT = process.env.PORT || 5500
server.listen(PORT, () =>{
    console.log('Server is running on port 5500...')
})

