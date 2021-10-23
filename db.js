require('./models/employee-model')
const mongoose = require('mongoose');
const uri =  "mongodb+srv://Adehenry:Adehenry%401@cluster0.up9zn.mongodb.net/adehenrydatabase?retryWrites=true&w=majority"

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true}, (err) => {

    if(!err) {
      console.log('MongoDB connection successful')
    } else {
      console.log(`Error in DB connection:` + err)
    }
})


