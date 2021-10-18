const mongoose = require('mongoose')
require('mongoose-type-email');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    maidenName: {
        type: String,
        trim: true,
    },
    gender: {
        type: String,
        required: true,
        trim: true,
    },
    // address:{
    //     type: String,
    //     required: true,
    //     trim:true,
    // },

    address_line1: {
        type: String,
        required: true,
        trim: true,
    },

    address_line2: {
        type: String,
        trim: true,
    },

    address_city: {
        type: String,
        required: true,
        trim: true,
    },

    address_post: {
        type: Number,
        required: true,
        trim: true,
    },
    dob: {
        type: Date,
        required: true,
        trim: true,
    },
    gpName: {
        type: String,
        trim: true,
    },
    // gpAddress:{
    //     type: String,
    //     trim:true,
    // },
    gpAddress_line1: {
        type: String,
        required: true,
        trim: true,
    },

    gpAddress_line2: {
        type: String,
        trim: true,
    },

    gpAddress_city: {
        type: String,
        required: true,
        trim: true,
    },

    gpAddress_post: {
        type: Number,
        required: true,
        trim: true,
    },
    mobile: {
        type: Number,
        trim: true,
        required: true,
    },
    discloseIdentity: {
        type: String,
        required: true,
        trim: true,
    },
    receiveLetter: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: mongoose.SchemaTypes.Email,
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
    disableForm: {
        type: String,
        trim: true,
    },
    familyId: {
        type: String,
        required: true,
        trim: true,
    },
    proBandId: {
        type: String,
        required: true,
        trim: true,
    },
    trakGeneId: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        trim: true,
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema)

module.exports = User


