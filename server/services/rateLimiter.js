import RateLimit from '../schemas/rateLimit';

// 10 logins per 45 minutes
const LIMIT = 10;
const WINDOW_MINUTES = 45;

export const checkRateLimit = async (ip, endpoint) => {
  const windowMs = WINDOW_MINUTES * 60 * 1000;
  const now = new Date();

  const record = await RateLimit.findOne({ ip, endpoint });

  if (record) {
    const timePassed = now - new Date(record.lastAttempt);

    if (timePassed < windowMs) {
      if (record.attempts >= LIMIT) {
        return { allowed: false, retryAfter: windowMs - timePassed };
      }

      record.attempts += 1;
      record.lastAttempt = now;
      await record.save();
      return { allowed: true };
    }

    // Reset window
    record.attempts = 1;
    record.lastAttempt = now;
    await record.save();
    return { allowed: true };
  }

  await RateLimit.create({ ip, endpoint, attempts: 1 });
  return { allowed: true };
};
