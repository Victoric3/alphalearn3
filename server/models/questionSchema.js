const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  examBody: {
    type: String,
    default: "king's heart"
  },
  examClass: {
    type: String,
    default: "All grades"
  },
  course: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
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
  },
  image: {
    type: String,
    default: null
  }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
