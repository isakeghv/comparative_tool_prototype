import mongoose from 'mongoose';
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
	question: { type: String, required: true },
	required: { type: Boolean, required: true },
	responseType: {
		type: String,
		enum: [
			'radio',
			'checkbox',
			'range',
			'drop',
			'linear',
		],
		required: true,
	},
	// radio: { type: String },
	checkbox: {
		// options: [{ type: String }],
		selectionMin: { type: Number },
		selectionMax: { type: Number }
	},
	range: {
		min: { type: Number },
		max: { type: Number },
		startLabel: { type: String },
		endLabel: { type: String }
	},
	drop: {
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
			'text',
			'radio',
			'number',
			'date',
		]
	},
	required: {
		type: Boolean,
		required: true,
	},
	text: {
		maxChar: {
			type: Number,
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
		},
		max: {
			type: Number,
		},
	}
});

// saving study schema with relevant questions, settings, and participant/study information
const StudySchema = new Schema({
	// new data-generated id
	id: { type: String, required: true },
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'UserProfile',
		required: true,
	},
	customTerms: {
		request: { type: Boolean, default: false},
		terms: { type: String }
	},
	title: { type: String, required: true },
	description: String,
	currentReplies: { type: Number, default: 0 },
	status: {
		type: String,
		enum: ['ongoing', 'completed', 'draft'],
		required: true,
		default: 'draft',
	},
	closingMethod: { type: Array },
	closingLimit: {
		date: { type: Date },
		duration: { type: String },
		responses: { type: Number },
	},
	desiredResponses: { type: Number },
	questions: [QuestionSchema],
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

export const Study = mongoose.model('Study', StudySchema);
