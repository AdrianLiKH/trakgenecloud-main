const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const familyIdSchema = new Schema({
    currentId:{
        type: Number,
        required: true,
        trim:true,
    }
}, {
    timestamps: true
});

const FamilyId = mongoose.model('FamilyId',familyIdSchema)

module.exports = FamilyId


