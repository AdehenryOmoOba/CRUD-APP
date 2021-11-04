require('./models/employee-model')
const mongoose = require('mongoose');
const uri =  process.env.DB_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true}, (err) => {

    if(!err) {
      console.log('MongoDB connection successful')
    } else {
      console.log(`Error in DB connection:` + err)
    }
})


