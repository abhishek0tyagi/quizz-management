const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const quizzContest = new mongoose.Schema({
    entryFee: {
        type: Number,
        required: true,
    },
    prizePool: {
        type: Number,
        required: true,
    },
    totalWinner: {
        type: Number,
        required: true
    },
    isGuranted: {
        type: Boolean,
        default:false
    },
    totalSpots:{
     type:Number
    },
    bonus: {
        type: Number,
        default: 0
    },
    totalQuestions:{
        type:Number
    },
    deletedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    dateAndTime: {
        type: Date,
    }

}, { timestamps: true })    

module.exports = mongoose.model('quizzContest', quizzContest) 