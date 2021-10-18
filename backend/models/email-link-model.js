const mongoose = require('mongoose')
require('mongoose-type-email');

const Schema = mongoose.Schema;

const emailSchema = new Schema({
    email:{
        type: mongoose.SchemaTypes.Email,
        required: true,
        trim:true,
    },
    token:{
        required: true,
        type: String,
        trim:true,
    },
    currentId:{
        required: true,
        type: Number,
        trim:true,
    },
    trakGeneId:{
        type: String,
        trim:true,
    },
    userEmail:{
        type: mongoose.SchemaTypes.Email,
        required: true,
        trim:true,
    },
    userType:{
        type: String,
        required: true,
        trim:true,
    }, 
}, {
    timestamps: true
});

const Email_link = mongoose.model('Email_Link',emailSchema)

module.exports = Email_link


