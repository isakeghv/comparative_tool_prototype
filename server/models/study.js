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
			"radio",
			"checkbox",
			"range",
			"drag",
			"linear",
		],
		required: true,
	},
	radio: {
		options: [{ type: String }]
	},
	checkbox: {
		options: [{ type: String }],
		selectionMin: { type: Number },
		selectionMax: { type: Number }
	},
	range: {
		min: { type: Number },
		max: { type: Number },
		startLabel: { type: String },
		endLabel: { type: String }
	},
	drag: {
		dropBox: [{ type: String }]
	},
	linear: {
		startLabel: { type: String },
		endLabel: { type: String }
	},
	artifacts: [ArtifactSchema],
});

// structure of demographic questions
const DemographicSchema = new Schema({
	id: {
		type: String,
		default: () => crypto.randomUUID(),
	},
	question: {
		type: String,
		required: true,
	},
	request: {
		type: Boolean,
		required: true,
	},
	responseType: {
		type: String,
		enum: [
			"text",
			"radio",
			"number",
			"date",
		]
	},
	required: {
		type: Boolean,
		required: true,
	},
	text: {
		maxWords: {
			type: Number,
			default: 0,
		},
	},
	radio: {
		options: {
			type: [String],
			default: [],
		},
	},
	number: {
		min: {
			type: Number,
			default: 0,
		},
		max: {
			type: Number,
			default: 100,
		},
	},
	date: {
		year: {
			type: Boolean,
			default: true,
		},
		month: {
			type: Boolean,
			default: false,
		},
		day: {
			type: Boolean,
			default: false,
		},
	},
});

// saving study schema with relevant questions, settings, and participant/study information
const StudySchema = new Schema({
	// new data-generated id
	id: { type: String, required: true },
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "UserProfile",
		required: true,
	},
	customTerms: {
		request: Boolean,
		terms: String,
	},
	title: { type: String, required: true },
	description: { type: String, required: true },
	currentReplies: { type: Number, default: 0 },
	/* closingMethod: { type: String, required: true }, */
	status: {
		type: String,
		enum: ["ongoing", "completed", "draft"],
		required: true,
		default: "draft",
	},
	closingLimit: {
		date: { type: Date },
		duration: { type: String },
		replies: { type: Number },
	},
	/* questions: [QuestionSchema] */
	demographicReq: { type: Boolean, required: true, default: false },
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
