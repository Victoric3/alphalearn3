const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionControllers');
const authController = require('../controllers/authController')

router
.route('/McqQuestion/:username')
.post(authController.apiLimiter, questionController.getAllQuestions);


module.exports = router;
