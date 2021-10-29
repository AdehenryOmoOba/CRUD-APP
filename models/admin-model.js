const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let adminSchema = new Schema({
    email: {type: String}, 
    username: {type: String, required: 'This field is required'},
    password: {type: String}
})



module.exports =  mongoose.model('admin', adminSchema);