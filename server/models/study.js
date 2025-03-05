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
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'UserProfile',
		required: true,
	},
	title: {
		type: String,
		required: true,
		default: 'Title'
		},
	content: {
		desc: {type: String},
		questions: [questionSchema] // store array of questions from questionSchema (follow its structure)
	},
	status: {
		type: String,
		enum: ["completed", "ongoing", "draft"],
		default: "draft",
	},
	created: {
		type: Date,
		immutable: true,
		default: Date.now
	},
	lastEdited: {
		type: Date,
		default: Date.now,
	},
	publishedAt: {
		type: Date,
		default: null, // will set when study has been published
	}
});
  
export const question = mongoose.model("Question", questionSchema);
export const study = mongoose.model("Study", studySchema);
