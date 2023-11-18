//query
const examBody= "joint admissions and matriculation exam";
const courses = ["Christian Religious Knowledge", 'English'];


const queryCreator = (topic, difficulty, course) => {
   return `Generate 10 ${examBody}-like question on ${course} on the topic [${topic.title}]
   and subtopics ${topic.subtopics}(don't leave any subtopic out)
and  its difficulty ${difficulty}....
   ensure every of these fields are available as an array of json objects: (the question, 
   course("${course}")
   topic("${topic.title}"),
   options(an array of 4 options),
   correct option(an index)(return as correct_option),
   detailed explanation(give a detailed reason for the answer)((return as explanation)),
   difficulty level(return as difficulty)), also ensure no question repeats], if the topic is vowel, it should be monothongs and diphthong questions`
}

module.exports = { queryCreator, courses }