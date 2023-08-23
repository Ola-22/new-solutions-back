const mongoose = require('mongoose'); // Erase if already required

const Schema = mongoose.Schema

// Declare the Schema of the Mongo model
var settingsSchema = new Schema({
    name:{
        type:Schema.Types.String,
        required:true,
    },
    image: {
        type: Schema.Types.String,
        // required: true,
    },
    address:{
        type:Schema.Types.String,
        required:true,
    },
    mobile:{
        type:Schema.Types.String,
        required:true,
    },
    secondaryMobile:{
        type:Schema.Types.String,
        required:true,
    },
    description:{
        type: Schema.Types.String,
        required: true,
    },
    email:{
        type: Schema.Types.String,
        required: true,
    }
});

//Export the model
module.exports = mongoose.model('Settings', settingsSchema);