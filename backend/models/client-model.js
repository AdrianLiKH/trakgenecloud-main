const mongoose = require('mongoose')
require('mongoose-type-email');

const Schema = mongoose.Schema;

const clientSchema = new Schema({
    email:{
        type: mongoose.SchemaTypes.Email,
        required: true,
        trim:true,
    },
    hashedPassword:{
        type: String,
        required: true,
        trim:true,
    },
    userType:{
        required: true,
        type: String,
        trim:true,
    },
    mongoDbType:{
        type: String,
        trim:true,
    },
    userName:{
        type: String,
        trim:true,
    },
    hashedMongoPassword:{
        type: String,
        trim:true,
    },
    clusterName:{
        type: String,
        trim:true,
    },
    databaseName:{
        type: String,
        trim:true,
    },
    port:{
        type: Number,
        trim:true,
    }
}, {
    timestamps: true
});

const ClientModel = mongoose.model('ClientModel',clientSchema)

module.exports = ClientModel


