const mongoose = require('mongoose'); // Erase if already required

const Schema = mongoose.Schema

// Declare the Schema of the Mongo model
var projectSchema = new Schema({
    title: {
        type: Schema.Types.String,
        required: true,
        trim: true
    },
    image: {
        type: Schema.Types.String,
        required: false,
    },
    description: {
        type: Schema.Types.String,
        required: true,
    },
    type:{
        type: Schema.Types.String,
        required: true,
        trim: true
    }
},{
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Project', projectSchema);