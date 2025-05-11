import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGetCookie = vi.fn();
const mockUseRuntimeConfig = vi.fn();
const mockVerify = vi.fn();

vi.mock('#imports', () => ({
  getCookie: mockGetCookie,
  useRuntimeConfig: mockUseRuntimeConfig,
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    verify: mockVerify,
  },
}));

let verifyToken;


beforeEach(async () => {

  verifyToken = (await import('../../server/services/jwt.js')).verifyToken;

  // Provide a mock secret key for jwt verification
  mockUseRuntimeConfig.mockReturnValue({
    private: { secretJWT: 'mock-secret' },
  });
});

describe('verifyToken', () => {
  // Positive Case:
  // Tests that a valid token correctly returns a decoded user ID
  it('should return valid and decoded payload for a correct token', () => {
    const fakeEvent = {};
    const mockDecoded = { userId: 'user123' };

    // Simulate a valid JWT token present in cookies
    mockGetCookie.mockReturnValue('valid.token.here');

    // Simulate jwt.verify returning decoded data
    mockVerify.mockReturnValue(mockDecoded);

    const result = verifyToken(fakeEvent);

    // Expect the function to report the token is valid and include the decoded data
    expect(result).toEqual({ valid: true, decoded: mockDecoded });
  });

  // Negative Case:
  // Tests what happens when no token is found in cookies
  it('should return unauthorized if no token is found', () => {
    const fakeEvent = {};

    // Simulate no cookie present
    mockGetCookie.mockReturnValue(undefined);

    const result = verifyToken(fakeEvent);

    // Expect the function to return an unauthorized error
    expect(result).toEqual({
      user: null,
      error: 401,
      message: 'Unauthorized',
    });
  });

  // Edge/Negative Case:
  // Tests that an invalid or tampered token results in an error response
  it('should return error if token is invalid', () => {
    const fakeEvent = {};

    // Simulate an invalid token being present
    mockGetCookie.mockReturnValue('invalid.token');

    // Simulate jwt.verify throwing an error
    mockVerify.mockImplementation(() => {
      throw new Error('invalid signature');
    });

    const result = verifyToken(fakeEvent);

    // Expect the function to report the token is invalid and return the error message
    expect(result).toEqual({
      valid: false,
      error: 'invalid signature',
    });
  });
});
