import mongoose from "mongoose";
const { Schema } = mongoose;

// each schema below will be embedded directly into the 'StudySchema' document
// each artifact will contain a source (file path) and id (user-defined or generated)
const ArtifactSchema = new Schema({
  id: { type: String, required: true },
  source: { type: String, required: true },
});

// update earlier schema for questions and adding some validation so 'responseType' will correspond to its option
const QuestionSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true, default: "Question" },
  required: { type: Boolean, required: true },
  responseType: {
    type: String,
    enum: [
      "multipleChoice",
      "checkbox",
      "range",
      "dragAndDrop",
      "linearSorting",
    ],
    required: true,
  },
  multipleChoice: {
    options: [{ type: String }],
    required: function () {
      return this.responseType === "multipleChoice";
    },
  },
  checkbox: {
    options: [{ type: String }],
    selectionMin: { type: Number },
    selectionMax: { type: Number },
    required: function () {
      return this.responseType === "checkbox";
    },
  },
  range: {
    min: { type: Number },
    max: { type: Number },
    startLabel: { type: String },
    endLabel: { type: String },
    required: function () {
      return this.responseType === "range";
    },
  },
  dragAndDrop: {
    dropBox: [{ type: String }],
    required: function () {
      return this.responseType === "dragAndDrop";
    },
  },
  linearSorting: {
    startLabel: { type: String },
    endLabel: { type: String },
    required: function () {
      return this.responseType === "linearSorting";
    },
  },
  artifacts: [ArtifactSchema],
});

const DemographicSchema = new Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  request: { type: Boolean, required: true },
  responseType: { type: String, required: true },
  options: [{ type: String }],
  required: { type: Boolean, required: true },
  range: {
    min: { type: Number },
    max: { type: Number },
  },
});

// saving study schema with relevant questions, settings, and participant/study information
const StudySchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserProfile",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  currentReplies: { type: Number, default: 0 },
  closingMethod: { type: String, required: true },
  status: {
    type: String,
    enum: ["ongoing", "completed", "draft"],
    required: true,
    default: draft,
  },
  closingLimit: {
    date: { type: Date },
    duration: { type: String },
    replies: { type: Number },
  },
  questions: [QuestionSchema],
  demographicReq: { type: Boolean, required: true },
  demographic: [DemographicSchema],
  created: {
    type: Date,
    immutable: true,
    default: Date.now,
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

export const study = mongoose.model("Study", StudySchema);
