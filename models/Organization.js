const mongoose = require('mongoose');

const orgSchema = mongoose.Schema({
    orgId:{
        type: String,
        required: true
    },
    accountId:{
        type: String,
        required: true,
        unique: true
    },
    orgCounter:[
    {
       counterId: {
        type: String,
       }
    }
    ],
    orgName:{
        type: String,
        required: true
    },
    writeService:{
        type:Number,
        default: 0
    },
    orgUsers: [
        {   
            password : { type: String },
            userPermissions: { type: String },
            name: { type: String }
        }
    ],
})


module.exports = mongoose.model('organizations', orgSchema);