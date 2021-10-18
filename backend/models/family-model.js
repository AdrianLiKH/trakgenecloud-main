const mongoose = require('mongoose')
require('mongoose-type-email');
const Schema = mongoose.Schema;

const familySchema = new Schema({
    relationship: {
        type: String,
        required: true,
        trim: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    maidenName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    gender: {
        type: String,
        required: true,
        trim: true,
    },
    motherName: {
        type: String,
        trim: true,
    },
    fatherName: {
        type: String,
        trim: true,
    },
    dob: {
        type: Date,
        required: true,
        trim: true,
    },
    userEmail: {
        type: mongoose.SchemaTypes.Email,
        required: true,
        trim: true,
    },
    userType: {
        type: String,
        required: true,
        trim: true,
    },
    alive: {
        type: String,
        trim: true,
    },
    dod: {
        type: Date,
        trim: true,
    },
    //changes in regards to the new form format on teams
    // cancerPlace:{
    //     type: String,
    //     trim:true,
    // },
    // cancerAge:{
    //     type: String,
    //     trim:true,
    // },
    // cancerTreated:{
    //     type: String,
    //     trim:true,
    // },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    familyId: {
        type: String,
        required: true,
        trim: true,
    },
    familyMemberId: {
        type: String,
        required: true,
        trim: true,
    },
    trakGeneId: {
        type: String,
        trim: true,
    }

}, {
    timestamps: true
});

const Family = mongoose.model('Family', familySchema)

module.exports = Family

