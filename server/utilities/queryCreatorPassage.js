const examBody= "joint admissions and matriculation exam";    
const type = ['cloze', 'comprehension']
const courses = ["English language"];
const examClass= "SS3";

    const queryCreatorPassage = (type, course) => {
        return `i need a ${examBody}-like ${type} passage(important, return a passage of this form) and should be in this form, 
        ensure to fill the passage and questions with real data and be creative, 
        your javascript object data have this structure- but with real data simulating jamb-like exam passage, no repetition(required) 
        {
            "type": ${type},
            "exambody": ${examBody},
            "examClass": ${examClass}
            "course": ${course},
            "passage": (a ${type} passage, ensure its not less than 200 words, and always add a passage(!important)),
            "questions": [{
                question: {}(the question),
                  options: [](an array of four options),
                  correctOption: an index of the correct option,
                  explanation: the reason for the answer
            }](this questions array should contain 5 question)
          }, 
          the objective of the questions you are generating
          objective: (i. identify main points/topic sentences in passages;
          ii. determine implied meaning;
          iii. identify the grammatical functions of words, phrases, clauses and figurative/idiomatic expressions;
          iv. deduce or infer the writer's intentions including mood, attitude to the subject matter and opinion.)(objective doesnt need to be part of your response)
          `
        }
        
        const messagePassage = queryCreatorPassage(type[1], courses[0])
module.exports = {queryCreatorPassage, messagePassage}