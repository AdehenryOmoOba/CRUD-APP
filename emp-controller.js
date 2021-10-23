const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path/posix');
const Employee = require('./models/employee-model')

router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './index.html'))
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

router.get('/list', (req, res) => {
    Employee.find({}, function (err, items)  {
        res.render('list', { employeeList: items})
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