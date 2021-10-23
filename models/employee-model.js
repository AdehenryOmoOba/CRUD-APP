const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let employeeSchema = new Schema({
    fullName: {type: String, required: 'This field is required'},
    email: {type: String}, 
    mobile: {type: String}, 
    city: {type: String}
})



module.exports =  mongoose.model('Employee', employeeSchema);