const mongoose = require('mongoose');

const counterSchema = mongoose.Schema({
    counterId:{
        type:String,
        required:true,
    },
    orgId:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true,
    },
    counter:{
        type:Number,
        default:0
    },
})

module.exports = mongoose.model('counter', counterSchema);