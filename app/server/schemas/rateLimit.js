import mongoose from 'mongoose';

const rateLimitSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  endpoint: { type: String, required: true },
  attempts: { type: Number, default: 1 },
  lastAttempt: { type: Date, default: Date.now },
});

rateLimitSchema.index({ ip: 1, endpoint: 1 }, { unique: true });

export default mongoose.models.RateLimit || mongoose.model('RateLimit', rateLimitSchema);
