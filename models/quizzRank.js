const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const quizzRank = new mongoose.Schema({
    contestId: {
        type: ObjectId,
        required: true,
    },
   rank:{
    type:[String]
   },
 prize:{
  type:[Number]
 },
    createdAt:{
        type: Date
    },
}, { timestamps: true })    

module.exports = mongoose.model('quizzRank', quizzRank)