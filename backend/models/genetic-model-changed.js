const mongoose = require('mongoose')
require('mongoose-type-email');
const Schema = mongoose.Schema;

const geneticSchema = new Schema({
    isJewish:{
        type: String,
        trim:true,
    },
    isWomanCancer:{
        type: String,
        trim:true,
    },
    agePeriods:{
        type: Number,
        trim:true,
    },
    ageMenopause:{
        type: Number,
        trim:true,
    },
    isContraseptive:{
        type: String,
        trim:true,
    },
    contraceptiveAge:{
        type: Number,
        trim:true,
    },
    isHrt:{
        type: String,
        trim:true,
    },
    HrtLong:{
        type: Number,
        trim:true,
    },
    breastProblem:{
        type: String,
        trim:true,
    },
    majorIllness:{
        type: String,
        trim:true,
    },
    riskCancer:{
        type: String,
        trim:true,
    },
    chancesCancer:{
        type: String,
        trim:true,
    },
    mainGeneticsQuestions:{
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
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User',required:true},
    
}, {
    timestamps: true
});


const GeneticsChanged = mongoose.model('GeneticsChanged',geneticSchema)

module.exports = GeneticsChanged

