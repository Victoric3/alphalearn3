const Passage = require('../models/passageSchema')
    const createMcqQuestion = async ({
            examBody,
            examClass,
            course,
            type,
            passage,
            questions
        }) => {

        try {
            const newQuestion = new Passage({
                examBody,
                examClass,
                course,
                type,
                passage,
                questions
            });

            await newQuestion.save();
        } catch (error) {
            console.error(`Error storing ${examBody} question:`, error);
        }
    };                 

    exports.generateMcqQuestionsPassage = async(message, message2, openai, openai2) => {

        const chat = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: message, 
        }
    ],
    max_tokens:3800
    
    });
    const chat2 = await openai2.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: message2, 
        }
    ],
    max_tokens:3800
    
    });
    
    
    
    let answers = JSON.parse(chat.choices[0].message.content);
    let answers2 = JSON.parse(chat2.choices[0].message.content);
    // let answers = chat.choices[0].message.content
    // let answers2 = chat2.choices[0].message.content
    // console.log(answers, chat.choices[0].message, answers2);
    const totalAnswers = [
      answers, 
      answers2
    ]
    console.log(totalAnswers);
    totalAnswers.forEach(async(answer) => {
        try{
        await createMcqQuestion({
          examBody: answer.examBody,
          examClass: answer.examClass,
          course : answer.course,
          type : answer.type,
          passage: answer.passage,
          questions: answer.questions
        });
    }catch(e){
        console.log(e);
    }
      });
    
    return totalAnswers
    }