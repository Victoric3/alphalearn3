const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionControllers');
const authController = require('../controllers/authController')

router
.route('/McqQuestion/:apiKey/:username')
.post(authController.apiLimiter, authController.apiKeyProtect, questionController.getAllQuestions);


module.exports = router;
