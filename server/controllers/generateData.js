// const {createMcqQuestion} = require('./questionControllers')
// const examClass= "SS3";

// exports.generateMcqQuestions = async(message, message2, openai, openai2) => {
//   const examBody= "joint admissions and matriculation exam";

//     const chat = await openai.chat.completions.create({
//   model: 'gpt-3.5-turbo',
//   messages: [
//     {
//       role: 'user',
//       content: message, 
//     }
// ],
// max_tokens:3500

// });
// const chat2 = await openai2.chat.completions.create({
//   model: 'gpt-3.5-turbo',
//   messages: [
//     {
//       role: 'user',
//       content: message2, 
//     }
// ],
// max_tokens:3800

// });



// let answers = JSON.parse(chat.choices[0].message.content);
// let answers2 = JSON.parse(chat2.choices[0].message.content);
// const totalAnswers = [
//   ...answers, 
//   ...answers2, 
// ]
// console.log(totalAnswers);
// totalAnswers.forEach(async(answer) => {
//     try{
//     await createMcqQuestion({
//       examBody: examBody,
//       examClass: examClass,
//       course: answer.course,
//       topic: answer.topic,
//       difficulty: answer.difficulty,
//       question: answer.question,
//       options: answer.options,
//       correctOption: answer.correct_option,
//       explanation: answer.explanation
//     });
// }catch(e){
//     console.log(e);
// }
//   });

// return totalAnswers
// }
