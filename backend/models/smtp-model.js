const mongoose = require('mongoose')
require('mongoose-type-email');

const Schema = mongoose.Schema;

const smtpSchema = new Schema({
    user:{
        type: mongoose.SchemaTypes.Email,
        required: true,
        trim:true,
    },
    host:{
        type: String,
        required: true,
        trim:true,
    },
    secure:{
        required: true,
        type: String,
        trim:true,
    },
    port:{
        required: true,
        type: Number,
        trim:true,
    },
    password:{
        required: true,
        type: String,
        trim:true,
    },
    
}, {
    timestamps: true
});

const SMTP_MODEL = mongoose.model('SmtpModel',smtpSchema)

module.exports = SMTP_MODEL


