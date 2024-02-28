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
const {generateMcqQuestions} = require('../controllers/generateData')
const {queryCreator , courses} = require('../utilities/queryCreator')
const {crsTopics} = require('../data/crsTopics')
// const {englishTopics} = require('../data/englishTopics')
const {messagePassage} = require('../utilities/queryCreatorPassage')
// const { generateMcqQuestionsPassage } = require('../controllers/passageController')

const message1 = queryCreator(crsTopics[20] , 'hard', courses[0])
const message2 = queryCreator(crsTopics[21] , 'hard', courses[0])
const message3 = queryCreator(crsTopics[22] , 'hard', courses[0])
const message4 = queryCreator(crsTopics[23] , 'hard', courses[0])
const message5 = queryCreator(crsTopics[24] , 'hard', courses[0])  //enter next req
const message6 = queryCreator(crsTopics[25] , 'hard', courses[0]) // enter next req
const message7 = queryCreator(crsTopics[26] , 'hard', courses[0])
const message8 = queryCreator(crsTopics[27] , 'hard', courses[0])
const message9 = queryCreator(crsTopics[14] , 'hard', courses[0])
const message10 = queryCreator(crsTopics[15] , 'hard', courses[0]) //topics last stoped at 14 and 15

async function startServer() {
    try {
        // await Promise.all([
        //   // generateMcqQuestions(message, message2, openai, openai2),
        //   generateMcqQuestions(message1, message2, openai3, openai4),
        //   generateMcqQuestions(message3, message4, openai5, openai6),
        //   generateMcqQuestions(message7, message8, openai7, openai8),
        //   generateMcqQuestions(message5, message6, openai9, openai2),
        //   generateMcqQuestions(message9, message10, openai10, openai11)
        // ]);
      } catch (error) {
        console.error('Error generating MCQ questions:', error);
      }
}
exports.callStartServerMultipleTimes = (totalCalls, callsPerInterval) => {
  console.log('started');
  let callsCount = 0;
  let intervalsCompleted = 0;
  const totalIntervals = Math.ceil(totalCalls / callsPerInterval); 

  const interval = 300000;

  const intervalId = setInterval(() => {
    for (let i = 0; i < callsPerInterval; i++) {
      startServer();
      callsCount++;

      if (callsCount >= totalCalls) {
        clearInterval(intervalId);
        intervalsCompleted++;
        if (intervalsCompleted === totalIntervals) {
          console.log("Done💯💯"); 
        }
        break;
      }
    }
  }, interval);
}

