import mongoose from "mongoose";
const { Schema } = mongoose;

const participantSchema = new Schema({
  study: { type: String, required: true },
  answers: { type: Object, required: true },
  demographic: { type: Object, default: {} },
  status: { type: String, default: 'complete' },
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Participant || mongoose.model('Participant', participantSchema);
