const Question = require('../models/questionSchema'); 
const Passage = require('../models/passageSchema')
const APIFEATURES = require('../utilities/apiFeatures')
const OpenAI = require("openai");
const {
    openai, 
    openai2, 
    openai3, 
    openai4, 
    openai5, 
    openai6,
    openai7,
    openai8, 
    openai9,
    openai10,
    openai11
} = require('../utilities/openaiApiKeys')

    
    //messages sent
   
/// save questions to database                                    
    exports.createMcqQuestion = async ({
          examBody,
          examClass,
          course,
          topic,
          difficulty,
          question,
          options,
          correctOption,
          explanation
  }) => {

  try {
    const newQuestion = new Question({
      examBody,
      examClass,
      course,
      topic,
      difficulty,
      question,
      options,
      correctOption,
      explanation
    });

    await newQuestion.save();
  } catch (error) {
    console.error(`Error storing ${examBody} question:`, error);
  }
};


exports.getAllQuestions = async (req, res) => {
  try {
    // Parse the payload from the client
    const { examBody, topicCombinations } = req.body;

    // Generate the exam session based on the payload
    const examSession = [];
    const promises = topicCombinations.map(async ({ topic, questions, course, difficulty, type }) => {
      // Retrieve 'questions' number of questions for the specified topic and course from MongoDB
      const selectedQuestions = await Question.aggregate([
        {
          $match: {
            course: { $regex: new RegExp(course, 'i') }, // Case-insensitive search for 'course'
            topic: { $regex: new RegExp(topic, 'i') },   // Case-insensitive search for 'topic'
            difficulty: { $regex: new RegExp({$in: difficulty}, 'i') },   // Case-insensitive search for 'topic'
          },
        },
        { $sample: { size: questions } },
      ])
        .exec();

        if( topic === 'passage' && course === 'English'){
          const passage = await Passage.aggregate([
            { $match: { 
              course: { $regex: new RegExp(course, 'i') }, 
              type: { $regex: new RegExp(type, 'i') } 
          } },
            { $sample: { size: questions } }, // You can adjust the sample size as needed
          ]).exec();
          
          // Add the Passage questions to the exam session
          examSession.push(...passage);
        }
          
          // Add the selected questions to the exam session
          examSession.push(...selectedQuestions);
        });

    

    
    // Wait for all queries to complete
    await Promise.all(promises);
    const limitedQuestions = examSession.length <= 200 ? examSession : examSession.slice(0, 200);

    // Construct and send the exam session as a response
    res.status(200).json({ 
      amount: limitedQuestions.length, 
      examSession: limitedQuestions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}






