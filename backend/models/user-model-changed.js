const mongoose = require('mongoose')
require('mongoose-type-email');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstName:{
        type: String,
        trim:true,
    },
    lastName:{
        type: String,
        trim:true,
    },
    maidenName:{
        type: String,
        trim:true,
    },
    gender:{
        type: String,
        trim:true,
    },
    // address:{
    //     type: String,
    //     trim:true,
    // },
    address_line1:{
        type: String,
        trim:true,
    },

    address_line2:{
        type: String,
        trim:true,
    },

    address_city:{
        type: String,
        trim:true,
    },

    address_post:{
        type: Number,
        trim:true,
    },
    dob:{
        type: Date,
        trim:true,
    },
    gpName:{
        type: String,
        trim:true,
    },
    // gpAddress:{
    //     type: String,
    //     trim:true,
    // },
     gpAddress_line1:{
        type: String,
        trim:true,
    },

    gpAddress_line2:{
        type: String,
        trim:true,
    },

    gpAddress_city:{
        type: String,
        trim:true,
    },

    gpAddress_post:{
        type: Number,
        trim:true,
    },
    mobile:{
        type: Number,
        trim:true,
    }, 
    discloseIdentity:{
        type: String,
        trim:true,
    }, 
    receiveLetter:{
        type: String,
        trim:true,
    },
    email:{
        type: mongoose.SchemaTypes.Email,
        required: true,
        trim:true,
    },
    disableForm:{
        type: String,
        trim:true,
    },
    familyId:{
        type: String,
        required: true,
        trim:true,
    }, 
    proBandId:{
        type: String,
        required: true,
        trim:true,
    },
    oldUser_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User',required:true},
    isUserDateConfirmed:{
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

const UserChanged = mongoose.model('UserChanged',userSchema)

module.exports = UserChanged

