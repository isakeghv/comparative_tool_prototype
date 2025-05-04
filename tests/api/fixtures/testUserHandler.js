import jwt from 'jsonwebtoken';

export function testUserHandler(token, users, profiles, studies, secret = 'mock-secret') {
  if (!token) return { user: null, error: 401, message: 'Unauthorized' };

  try {
    const decoded = jwt.verify(token, secret);
    const user = users.find((u) => u._id === decoded.userId);
    if (!user) throw new Error('User not found');

    const userProfile = profiles.find((p) => p._id === user.userProfile);
    const userStudies = studies.filter((s) => s.user === user.userProfile);

    return {
      userProfileData: userProfile,
      studies: userStudies,
    };
  } catch {
    return { user: null, error: 401, message: 'Invalid token' };
  }
}
