const express = require('express')
const router = express.Router()

const quizzContestController=require('../controllers/quizzContestController')

//****************api for quizz contest ********************/
router.post('/createQuizz',quizzContestController.createQuizz)
router.get('/fetchQuizz',quizzContestController.fetchAllQuizz)
router.post('/createRank',quizzContestController.createRank)
router.get('/quizzDetails',quizzContestController.quizzDetails)
router.post('/joinQuizz',quizzContestController.joinQuizz)
router.get('/joinedQuizz',quizzContestController.joinedQuizz)
router.get('/completedQuizz',quizzContestController.completedQuizz)
router.post('/calculatePoints',quizzContestController.calculatePoints)
router.get('/quizzResultUser',quizzContestController.quizzResultUser)
router.get('/fetchResultAll',quizzContestController.fetchResultAll)

/***********************End qizz contest api************************/

module.exports = router
