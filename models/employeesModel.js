const mongoose = require('mongoose'); // Erase if already required

const Schema = mongoose.Schema

// Declare the Schema of the Mongo model
var employeeSchema = new Schema({
    firstname:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    lastname:{
        type:String,
        required:true,
        unique:true,
    },
    job:{
        type:String,
        required:true,
        unique:true,
    },
    image:{
        type:String,
        // required:true,
    },
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Employee', employeeSchema);