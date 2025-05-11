import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockVerify = vi.fn();

vi.mock('jsonwebtoken', () => ({
  default: {
    verify: mockVerify,
  },
}));

let testUserHandler;

beforeEach(async () => {
  testUserHandler = (await import('./fixtures/testUserHandler.js')).testUserHandler;
});

const users = [{ _id: 'user123', userProfile: 'profile123' }];
const profiles = [{ _id: 'profile123', name: 'John Doe' }];
const studies = [{ user: 'profile123', title: 'Study A' }];

// Test suite for testUserHandler
describe('testUserHandler - Token Verification and User Data Fetching', () => {

  // Positive Test Case
  // A valid token is provided and the user, profile, and studies match.
  it('should return userProfileData and studies for a valid token', () => {
    mockVerify.mockReturnValueOnce({ userId: 'user123' });

    const result = testUserHandler('valid.token', users, profiles, studies);

    expect(result).toEqual({
      userProfileData: { _id: 'profile123', name: 'John Doe' },
      studies: [{ user: 'profile123', title: 'Study A' }],
    });
  });

  // Negative Test Case
  // No token is provided (unauthenticated request).
  it('should return 401 error if no token is provided', () => {
    const result = testUserHandler(null, users, profiles, studies);

    expect(result).toEqual({
      user: null,
      error: 401,
      message: 'Unauthorized',
    });
  });

  // Edge/Negative Test Case
  // An invalid or corrupted token is provided (e.g., expired, tampered).
  it('should return 401 error if token is invalid', () => {
    mockVerify.mockImplementationOnce(() => {
      throw new Error('Invalid token');
    });

    const result = testUserHandler('invalid.token', users, profiles, studies);

    expect(result).toEqual({
      user: null,
      error: 401,
      message: 'Invalid token',
    });
  });
});
