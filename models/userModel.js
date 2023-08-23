const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require("bcrypt")

const Schema = mongoose.Schema

// Declare the Schema of the Mongo model
var userSchema = new Schema({
    firstname:{
        type: Schema.Types.String,
        required:true,
    },
    lastname:{
        type:Schema.Types.String,
        required:true,
    },
    email:{
        type:Schema.Types.String,
        required:true,
        unique:true,
    },
    mobile:{
        type:Schema.Types.String,
        required:true,
        unique:true,
    },
    password:{
        type:Schema.Types.String,
        required:true,
    },
    role: {
        type: Schema.Types.String,
        default: "user"
    },
    isBlocked: {
        type: Schema.Types.Boolean,
        default: false
    },
    cart:{
        type: Schema.Types.Array,
        default: []
    },
    address:[{type: Schema.Types.String, ref: "Address"}],
    wishlist: [{type: Schema.Types.ObjectId, ref: "Product"}],
    refreshToken:{
        type: Schema.Types.String
    }
}, {
    timestamps:true
});


userSchema.pre("save", async function(next){
    const salt = await bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.isPasswordMatched = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}
//Export the model
module.exports = mongoose.model('User', userSchema);