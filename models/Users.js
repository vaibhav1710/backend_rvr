const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    organizations: [
        {
            organizationId: { type: String },
            permission: {
                type: String
            }
        }
    ],
})

module.exports = mongoose.model('users', userSchema);