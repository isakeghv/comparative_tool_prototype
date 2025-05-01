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

// when publishing a study, if it's ongoing but no questions prevent it from updating status and throw error
// not this doesnt work yet
// StudySchema.pre('findOneAndUpdate', async function (next) {
// 	console.log('Check...');
  
// 	const update = this.getUpdate();
// 	const newStatus = update?.status;
  
// 	// check if status is being set to 'ongoing'
// 	if (newStatus === 'ongoing') {
// 		// retrieves the id used to get the study
// 		const studyId = this.getQuery().id;
// 		const currentStudy = await this.model.findOne({ id: studyId });
	
// 		if (!currentStudy) {
// 			return next(new Error('Study not found.'));
// 		}
	
// 		// check if it has no questions
// 		if (!currentStudy.questions || currentStudy.questions.length === 0) {
// 			return next(new Error('At least one question is required to publish the study.'));
// 		}
// 	}
  
// 	next();
// });  

export const Study = mongoose.model('Study', StudySchema);
