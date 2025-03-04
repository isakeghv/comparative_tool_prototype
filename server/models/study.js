import mongoose from "mongoose";
const { Schema } = mongoose;

// const demographicSchema

// schema for how a question could be structured, considering the response types they can have
const questionSchema = new mongoose.Schema({
  sortOrder: { type: Number, required: true }, // number to correspond to the ordering
  title: { type: String, default: 'Question', required: true },
  responeType: {
    type: String,
    enum: ['multipleChoice', 'checkbox', 'true/false', 'range', 'dragAndDrop', 'linearSorting'],
    required: true,
  },
  min: { type: Number },
  max: { type: Number },
  startLabel: { type: String },
  endLabel: { type: String },
  dropBox: [{ type: String }],
  artifacts: [{ type: String }] // store the file URL
});

const studySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: {
    desc: {type: String},
    questions: [questionSchema] // store array of questions from questionSchema (follow its structure)
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // reference to the User model from 'models/user.js'
    required: true,
  },
  status: {
    type: String,
    enum: ["completed", "ongoing", "draft"],
    default: "draft",
  },
  created: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  lastEdited: {
    type: Date,
    default: Date.now,
  },
  publishedAt: {
    type: Date,
    default: null, // will set when study has been published
  },
});

export const Question = mongoose.model("Question", studySchema);
export const Study = mongoose.model("Study", studySchema);
