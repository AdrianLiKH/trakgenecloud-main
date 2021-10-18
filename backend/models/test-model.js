const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const testSchema = new Schema({
    isJewish:{
        type: String,
        trim:true,
    },
    isWomanCancer:{
        type: String,
        trim:true,
    },
   
    
}, {
    timestamps: true
});




module.exports = testSchema;

