const mongoose = require('mongoose'); // Erase if already required

const Schema = mongoose.Schema

// Declare the Schema of the Mongo model
var serviceSchema = new Schema({
    title: {
        type: Schema.Types.String,
        required: true,
        trim: true
    },
    image: {
        type: Schema.Types.String,
        // required: true,
    },
    description: {
        type: Schema.Types.String,
        required: true,
    }
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Service', serviceSchema);