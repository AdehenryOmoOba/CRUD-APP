const express            = require('express');
const router             = express.Router();
const Admin              = require('../models/admin-model')
const LocalStrategy      = require('passport-local');
const passport           = require('passport')
const bcrypt             = require('bcrypt');
const Employee           = require('../models/employee-model')





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
router.get('/', isLoggedOut ,(req, res) => {
    const loginError = req.query.error;
    const loggedOut = req.query.logout;
    const registered = req.query.registered ;
    const invalidLogin = 'Login Unsuccessful'
    res.render('login', {error: loginError, loggedOutMessage: loggedOut,invalidLogin, registered})
})

router.post('/login', passport.authenticate('local', {successRedirect: '/list?login=true', failureRedirect: '/?error=true'}))

router.get('/register', (req, res) => {
    
    res.render('register' )
})

router.post('/register', async (req, res) => {
 
    
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


router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/?logout=true')
})

router.get('/insert', (req, res) => {
    res.render('insert')
})


router.post('/login', (req, res) => {

    res.redirect('/list')
})


// Insert/Update data into database..........

router.post('/', (req, res) => {
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

router.get('/list', isLoggedIn ,(req, res) => {
    Employee.find({}, function (err, items)  {
        const login = req.query.login
        const userName = req.user.username
        res.render('list', { employeeList: items, username: userName,login})

    })
        
})

// Edit employee data......

router.get('/:id', (req, res) => {
    Employee.findById(req.params.id,  function (err, item)  {
        if(!err){
            res.render('edit', { employeeList: item})
        } else {
            return
        }
       
    })
        
  
})

router.get('/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, item) => {
        res.redirect('/list')
    })  
})


module.exports = router;