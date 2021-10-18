const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const adminLoginSchema = new Schema({
    email:{
        type: String,
        required: true,
        trim:true,
    },
    hashedPassword:{
        type: String,
        trim:true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Admin',adminLoginSchema)


