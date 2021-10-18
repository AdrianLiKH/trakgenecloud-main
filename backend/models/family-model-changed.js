const mongoose = require('mongoose')
require('mongoose-type-email');
const Schema = mongoose.Schema;

const familySchema = new Schema({
    relationship:{
        type: String,
        trim:true,
    },
    firstName:{
        type: String,
        trim:true,
    },
    maidenName:{
        type: String,
        trim:true,
    },
    lastName:{
        type: String,
        trim:true,
    },
    gender:{
        type: String,
        trim:true,
    },
    motherName:{
        type: String,
        trim:true,
    },
    fatherName:{
        type: String,
        trim:true,
    },
    dob:{
        type: Date,
        trim:true,
    },
    alive:{
        type: String,
        trim:true,
    },
    dod:{
        type: Date,
        trim:true,
    },
    cancerPlace:{
        type: String,
        trim:true,
    },
    cancerAge:{
        type: String,
        trim:true,
    },
    cancerTreated:{
        type: String,
        trim:true,
    },
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
    familyId:{
        type: String,
        required: true,
        trim:true,
    }, 
    familyMemberId:{
        type: String,
        required: true,
        trim:true,
    },
    isfamilyMemberDateConfirmed:{
        type: String,
        required:true,
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

const FamilyChanged = mongoose.model('FamilyChanged',familySchema)

module.exports = FamilyChanged

 