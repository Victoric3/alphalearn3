const mongoose = require('mongoose');


const questionSchema = new mongoose.Schema({
      question: {
        type: String,
        required: true
      },
      options: {
        type: [String],
        required: true
      },
      correctOption: {
        type: String,
        required: true
      },
      explanation: {
        type: String,
        default: "no official explanation is available at this time"
      }
})


const passageSchema = new mongoose.Schema({
  examBody: {
    type: String,
    default: "Questell"
  },
  examClass: {
    type: String,
    default: "All grades"
  },
  course: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  passage: {
    type: String,
    required: true
  },
  questions: [questionSchema]
  
});

const Passage = mongoose.model('Passage', passageSchema);

module.exports = Passage;
