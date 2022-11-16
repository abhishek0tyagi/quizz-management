const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const quizzContestDetails = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    contestId: {
        type: ObjectId,
        required: true,
    },
    WinStatus: {
        type: Boolean,
        default:false
    },
    totalWinning: {
        type: Number,
        default: 0
    },
    points: {
        type: Number,
        default: 0
    },
     score: {
        type: Number,
        default: 0
    },
    status:{
      type:String,
       default:"incomplete"
    },
    deletedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date
    },
}, { timestamps: true })    

module.exports = mongoose.model('quizzContestDetails', quizzContestDetails) 