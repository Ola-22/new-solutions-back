const mongoose = require('mongoose'); // Erase if already required

const Schema = mongoose.Schema

// Declare the Schema of the Mongo model
var blogSchema = new Schema({
    title:{
        type:Schema.Types.String,
        required:true,
        unique:true,
        index:true,
    },
    description:{
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
module.exports = mongoose.model('Blog', blogSchema);