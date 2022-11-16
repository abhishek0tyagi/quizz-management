const quizzContest = require("../models/quizzContest");
const quizzContestDetail=require("../models/quizzContestDetails")
const quizzRank=require("../models/quizzRank")
const { ObjectId } = require('mongoose').Types;

//api to create quizz 
const createQuizz = async function (req, res) {
  try {
    const data = req.body;
    const {
      entryFee,
      prizePool,
      totalWinner,
      totalSpots,
      isGuranted,
      bonus,
      dateAndTime,
      totalQuestions
    } =  req.body;
  if(!(entryFee) || !(prizePool) || !(totalWinner) || !(isGuranted) || !(bonus) || !(totalQuestions))
  {
    return res.send({status:false,message:"please provide all the details"})
  }
    //creating quizz Contest
    var quizz = await quizzContest.create(data);
    // response
    res.status(201).send({
      status_code: true,
      message: "Success",
      data: quizz,
    });
  } catch (err) {
    res.status(500).send({
      status_code: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

//creating quizz rank collection with contest id
const createRank =async function(req,res){
  try{
  const data =req.body;
  const {
    contestId,
    rank,                 //rank and prize must be array
    prize
  }=req.body
  if(!(contestId) || !(rank) || !(prize))
  {
    return res.send({status:false,message:"please provide all the details"})
  }
  console.log(contestId,rank,prize)
    //creating quizz rank
    var rankQuizz = await quizzRank.create(data);
    // response
    res.status(201).send({
      status_code: true,
      message: "Success",
      data: rankQuizz,
    });
  } catch (err) {
    res.status(500).send({
      status_code: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

//fetching all quizz 
const fetchAllQuizz = async function (req, res) {
  try {
    var quizz = await quizzContest.find();
    // response
    res.status(201).send({
      status_code: true,
      message: "Success",
      data: quizz,
    });
  } catch (err) {
    res.status(500).send({
      status_code: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
}; 

////************************need to complete this quuizz detail user ****************************////
//fetching particular quizz contest details using contestId 
const quizzDetails=async function(req,res){
  try{
const {contestId,userId} =req.body;
const details=await quizzContest.aggregate([
{
  $match:{
    _id:ObjectId(contestId)
  }
},
  {
    $lookup: {
        "from": "quizzranks",
        "localField": "_id",
        "foreignField": "contestId",
        "as": "rankDetails"
    }
},
{
  $lookup:{
    "from":"quizzcontestdetails",
    "localField":"_id",
    "foreignField":"contestId",
    "as":"quizzDetails"
  }
}
]);
res.status(201).send({
  status_code: true,
  message: "quizz details",
  data:details
})
   }
catch(err)
{
  res.status(500).send({
    status_code: false,
    message: "Internal Server Error",
    error: err.message,
  });
}

};

//api to join the quizz
const joinQuizz=async function (req, res) {   //expecting token and contest Id
  try {
    const data = req.body;
    const userDeatail=await user.find({token:token});
    var joinQuizz = await quizzContestDetail.create(data);
    // response
    res.status(201).send({
      status_code: true,
      message: "Successfully joined contest",
      data:joinQuizz
    });
  } catch (err) {
    res.status(500).send({
      status_code: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

//api to fetch joined quizzed by a user
const joinedQuizz=async function (req, res) {   //expecting token and return all joined quizz contest
  try {
    const data = req.body;
    var joinedQuizz = await quizzContestDetail.aggregate([
      {
        $match:{
          "userId":data.token,
          $or: [ { status: "incomplete"}, { dateAndTime: { $lt: Date.now() } } ] 
        } 

      },
      {
        "$lookup": {
            "from": "quizzcontests",
            "localField": "contestId",
            "foreignField": "_id",
            "as": "contest"
        }
    },
    {
      $project:{
        contestId:1,
        contest:1
      }
    },
    {
      "$unwind": "$contest"
  },
  {
    $project:{
      contestId:1,
      "entryFee":"$contest.entryFee",
      "prizePool":"$contest.prizePool",
      "totalWinner":"$contest.totalWinner",
      "gurantedPrize":"$contest.gurantedPrize",
      "bonus":"$contest.bonus"

    }
  }
    ])
    res.status(201).send({
      status_code: true,
      message: "Success",
      data:joinedQuizz
    });
  } catch (err) {
    res.status(500).send({
      status_code: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

//api to feth completed quizz by a user
const completedQuizz=async function (req, res) {   //expecting user id and return all completed quizz contest
  try {
    const data = req.body;
    
    var completedQuizz = await quizzContestDetail.aggregate([
      {
        $match:{
          "userId":data.token,
          $or: [ { status: "complete"}, { dateAndTime: { $gt: Date.now() } } ] 
        } 
      },
      {
        "$lookup": {
            "from": "quizzcontests",
            "localField": "contestId",
            "foreignField": "_id",
            "as": "contest"
        }
    },
    {
      $project:{
        contestId:1,
        contest:1
      }
    },
    {
      "$unwind": "$contest"
  },
  {
    $project:{
      contestId:1,
      "entryFee":"$contest.entryFee",
      "prizePool":"$contest.prizePool",
      "totalWinner":"$contest.totalWinner",
      "gurantedPrize":"$contest.gurantedPrize",
      "bonus":"$contest.bonus"

    }
  }
    ])
    // response
    res.status(201).send({
      status_code: true,
      message: "Success",
      data:completedQuizz
    });
  } catch (err) {
    res.status(500).send({
      status_code: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

 //api to calculate points after every answer
const calculatePoints =async function(req,res) {
  try{
    //status will be sent at last given answer.
    const {score,points,token,contestId,status}=req.body;
    const currentPoints =await quizzContestDetail.find({
  token:token,contestId:contestId
},{points:1});
var finalPoints=currentPoints+points;    //have to ask about points
if(score)
{
  var updateScore=await quizzContestDetail.updateOne({token:token,contestId:contestId},{points:finalPoints,score:score});
}
else{
  var updateScore=await quizzContestDetail.updateOne({token:token,contestId:contestId},{points:finalPoints});
}
if(status==complete )
{
  var updatecontest=await quizzContestDetail.find({token:token},{$set:{status:"complete"}})
}
res.status(200).send({
  status_code:true,
  message:sucess
})
  }
  catch (err) {
    res.status(500).send({
      status_code: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

////fetch result of user at end of quizz
const quizzResultUser =async function(req,res) {
  try{
      const {token,contestId}=req.body;
      const result =await quizzContestDetail.find({
        token:token,contestId:contestId
      });

      res.status(200).send({

        status_code:true,
        message:sucess,
        data:result
      })
  }
  catch (err) {
    res.status(500).send({
      status_code: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }  
};

//fetch user result,points and all users points with rank 
const fetchResultAll=async function(req,res){
  try{
    const {contestId,token}=req.body;  
    const data=await quizzContest.aggregate([
      {
        $match:{
          contestId:ObjectId(contestId)
        }
      },
      {
        $project:{
          prizePool:1,
          totalSpots:1,
          entryFee:1,
          contestId:1
        }
      },
      {
        "$lookup": {
            "from": "quizzcontestdetails",
            "localField": "contestId",
            "foreignField": "_id",
            "as": "pointsData"
        }
    },
    {
      "$lookup": {
          "from": "users",
          "localField": "token",
          "foreignField": "token",
          "as": "userData"
      }
  },
  { $unwind: { path: "$pointsData" } } ,
  {
    $unwind:{
      path:"$userData"
    }
  },
  {
    $project:{
      prizePool:1,
      totalSpots:1,
      entryFee:1,
      contestId:1,
      points:$pointsData.points,
      userName:$userData.userName
    }
  },
  {
    $group: {
          _id: "$",contestId,
          prizePool: { $first: '$prizePool' },
          totalSpots: { $first: '$totalSpots' },
          entryFee: { $first: '$entryFee' },
          points:{$first:'$points'},
          userName:{$first:'$username'}
      }
  },
  {
    $sort:{
      points:1
    }
  }
    ]);
    return res.status(200).send(
      {
        status_code:true,
        message:data
      }
    )
  }
  catch(err)
  {
    res.status(500).send({
      status_code: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }

};


module.exports = { createQuizz,createRank,fetchAllQuizz,quizzDetails,joinQuizz,joinedQuizz,completedQuizz,calculatePoints,quizzResultUser,fetchResultAll };


//http://63.1.132.117:5002