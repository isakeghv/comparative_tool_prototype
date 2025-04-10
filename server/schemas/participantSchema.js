import mongoose from "mongoose";
const { Schema } = mongoose;

/* const participantSchema = new Schema({
  study: { type: String, required: true },
  answers: { type: Object, required: true },
  demographic: { type: Object, default: {} },
  status: { type: String, default: 'complete' },
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Participant || mongoose.model('Participant', participantSchema);
*/
const QuestionSchema = new Schema({
    // reference question id from original study
    id: {
        type: String, 
        required: true
    },
    answer: [
        {
            id: {
                type: String, 
                required: true
            },
            label: {
                type: String
            }
        }
    ]
});

const ParticipantSchema = new Schema({
    study: {
        type: String,
        required: true
    },
    startTime: { 
        type: Date, 
        required: true,
        default: Date.now
    },
    timeTaken: { 
        type: Number 
    },
    status: {
        type: String,
        enum: [
            'partial',
            'completed'
        ], 
        default: 'partial'
    },
    questions: [QuestionSchema],
    demographic: { 
        answer: {
            type: Schema.Types.Mixed
        }
    }
});

// before saving the document, get the time taken in millisecond
ParticipantSchema.pre('save', function (next) {
    if (this.status === 'completed') {
        const timeTaken = new Date() - this.startTime;

        // store minutes in `timeTaken` fields, rounded down
        this.timeTaken = Math.floor(timeTaken / 60000);
        }

    next();
});


export const Participant = mongoose.model('Participant', ParticipantSchema);
