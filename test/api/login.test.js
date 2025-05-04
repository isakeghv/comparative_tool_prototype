import { setup } from '@nuxt/test-utils';

beforeAll(async () => await setup({ testDir: __dirname }))

import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

import { loginLogic } from '../../server/api/login';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { useRuntimeConfig, setCookie } from '#imports';
import validator from "validator";
import { readBody, setResponseStatus, getRequestHeader, defineEventHandler } from "h3";
import { connDb } from '~/server/services/connDb.js';
import { UserCredential } from '~/server/schemas/userSchema.js';
import { checkRateLimit } from '~/server/services/rateLimiter.js';
import { $fetch } from 'ofetch';

//mockup for returning a user: So it does not need to make a real call
vi.mock('~/server/schemas/userSchema.js', () => ({ UserCredential: { findOne: vi.fn() } }));

//mockup for comparing password: So it does not need to be actually compared, 
// instead the mockup can be set to return the desired response
vi.mock('bcryptjs', () => ({ default: { compare: vi.fn() } }))

//mockup for signing a jwt token used in cookie
vi.mock('jsonwebtoken', () => ({
    default: { sign: vi.fn(() => 'mocked-token') }
}));

//mockup for setting cookie and being able to get secret jwt key
vi.mock('#imports', () => ({
    setCookie: vi.fn(),
    useRuntimeConfig: vi.fn(() => ({
        TURNSTILE_SECRET_KEY: 'mock-testing-secret-key',
        private: {
            config: { secretJWT: 'someJwtSeret' }
        }
    }))
}))

//mockup for "validator"
vi.mock('validator', () => ({ default: { isEmail: vi.fn(), normalizeEmail: vi.fn() } }))

//mockup for setting response body, being able to read event body and get req header
vi.mock('h3', () => ({
    setResponseStatus: vi.fn(),
    readBody: vi.fn(),
    getRequestHeader: vi.fn(() => '127.0.0.1'),

    //bypassing the default eventHandler: to run the logic in "loginLogic" directly 
    // instead of passing via eventhandler: as this is not integration testing
    defineEventHandler: (fn) => fn
}))

//mockup for db connection
vi.mock('~/server/services/connDb.js', () => ({ connDb: vi.fn() }))

//mockup for checking rate limiter
vi.mock('~/server/services/rateLimiter.js', () => ({
    checkRateLimit: vi.fn(() => Promise.resolve({ allowed: true, retryAfter: 0 })),
    default: { checkRateLimit: vi.fn(() => Promise.resolve({ allowed: true, retryAfter: 0 })) }
}))

//mockup for fetching: To use instead of actual token validation with cloudflare
vi.mock('ofetch', () => ({ $fetch: vi.fn() }));

vi.mock('~/server/services/connDb.js', () => ({ connDb: vi.fn() }))

//some presets to use for data to pass with body
const email = {
    valid: 'valid@email.com', invalid: 'invalid@email.com', empty: '',
    cleaned: {
        valid: () => validator.normalizeEmail.mockReturnValue('valid@email.com'),
        invalid: () => validator.normalizeEmail.mockReturnValue('invalid@email.com')
    }
};
const pwd = { valid: 'validPassword', invalid: 'invalidPassword', empty: '' };
const token = { valid: 'validTestingToken', invalid: 'invalidTestingToken', empty: '', mocked: () => jwt.sign.mockReturnValue('testing-mocked-jwt-token') };


//mockup to use for setting true/false respons from validator.isEmail
const validEmail = {
    valid: () => validator.isEmail.mockReturnValue(true),
    invalid: () => validator.isEmail.mockReturnValue(false)
}

//running before each of the tests
beforeEach(() => {
    //resetting the mocks before each test to make sure that each test is correctly preformed
    vi.resetAllMocks()

    //setting that the token validation will be mocked, and return "true"
    $fetch.mockResolvedValue({ success: true })

    //connecting mock for connecting to db
    connDb.mockResolvedValue();

    //setting the turnstile key to be a mocked key used for testing
    process.env.TURNSTILE_SECRET_KEY = 'mock-testing-secret-key'
})

//preset for when a user is found and when a user is not found: to simplify and not have to write everything each time
const findUser = {
    //returns mockup user for when the user is found
    isFound: () => {
        UserCredential.findOne.mockReturnValue({
            lean: vi.fn().mockResolvedValue({
                _id: '4444',
                email: email.valid,
                password: 'someHashedPassword'
            })
        })
    },
    //returns mockup: null when user is not found
    isNotFound: () => UserCredential.findOne.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) })

}

//used for mocking password comparing
const pwdCompare = {
    valid: () => bcrypt.compare.mockResolvedValue(true),
    invalid: () => bcrypt.compare.mockResolvedValue(false)
}

describe('Testing login functionality', () => {
    describe('Testing for case: empty password', () => {
        it('Fails when pwd is empty', async () => {
            //creating mockup data to be passed as event content, and be read as body (using readBody)
            const event = { turnstileToken: token.valid, email: email.valid, password: pwd.empty };

            //setting mockup-data to be read as event when readBody is called
            readBody.mockImplementationOnce(() => Promise.resolve(event))

            findUser.isFound()

            //expected result for if password is empty
            await expect(loginLogic({})).resolves.toEqual({
                isValid: false,
                message: "Incorrect email or password."
            });
        })
    });

    //NOTE: this is designed for the test to fail if the logic does not check that password has been passed as parameter
    describe('Testing for case: missing password', () => {
        it('Fails when pwd is missing', async () => {
            //creating mockup data to be passed as event content, and be read as body (using readBody)
            const event = { turnstileToken: token.valid, email: email.valid };

            //setting mockup-data to be read as event when readBody is called
            readBody.mockImplementationOnce(() => Promise.resolve(event))

            //setting mockup for that the user is found: returns a mockup user
            findUser.isFound()

            //expected result for if password is empty
            await expect(loginLogic({})).resolves.toEqual({
                isValid: false,
                message: "Incorrect email or password."
            });
        })
    })

    describe('Testing for case: empty email', () => {
        it('Fails when email is empty', async () => {
            //creating mockup data to be passed as event content, and be read as body (using readBody)
            const event = { turnstileToken: token.valid, email: email.empty, password: pwd.valid };

            //setting mockup-data to be read as event when readBody is called
            readBody.mockImplementationOnce(() => Promise.resolve(event))

            //setting that user is not found
            findUser.isNotFound()

            //setting that password is compared and correct: For edgecase testing: make sure that it is not possible to bypass any way
            pwdCompare.valid()

            //expected result for if email is empty
            await expect(loginLogic({})).resolves.toEqual({
                isValid: false,
                message: "Incorrect email or password."
            });
        })
    });

    describe('Testing for case: missing email', () => {
        it('Fails when email is missing', async () => {
            //creating mockup data to be passed as event content, and be read as body (using readBody)
            const event = { turnstileToken: token.valid, password: pwd.valid };

            //setting mockup-data to be read as event when readBody is called
            readBody.mockImplementationOnce(() => Promise.resolve(event))

            //setting that user is not found
            findUser.isNotFound()

            //setting that password is compared and correct: For edgecase testing: make sure that it is not possible to bypass any way
            pwdCompare.valid()

            //expected result for it email is missing
            await expect(loginLogic({})).resolves.toEqual({
                isValid: false,
                message: "Incorrect email or password."
            });
        })
    });
    //NOTE this is designed for the test to fail if the logic does not check that body (event) has been passed as parameter
    describe('Testing response for missing body', () => {
        it('Fails body is missing', async () => {
            //setting mockup-data to be read as event when readBody is called
            readBody.mockImplementationOnce(() => Promise.resolve())

            //expected result for if body is missing
            await expect(loginLogic({})).resolves.toEqual({
                isValid: false,
                message: 'Invalid/incomplete input provided'
            });
        })
    });

    describe('Testing when email is incorrect', () => {
        it('Fails when email is incorrect', async () => {
            //creating mockup data to be passed as event content, and be read as body (using readBody)
            const event = { turnstileToken: token.valid, email: email.invalid, password: pwd.valid };

            //setting mockup-data to be read as event when readBody is called
            readBody.mockImplementationOnce(() => Promise.resolve(event))

            email.cleaned.invalid();
            //setting that user is not found
            findUser.isNotFound()
            validEmail.valid()

            //Expected result for if email is incorrect
            await expect(loginLogic({})).resolves.toEqual({
                isValid: false,
                message: 'Incorrect email or password.'
            });
        })
    });

    describe('Testing when password is incorrect', () => {
        it('Fails when password is incorrect', async () => {
            //creating mockup data to be passed as event content, and be read as body (using readBody)
            const event = { turnstileToken: token.valid, email: email.valid, password: pwd.invalid };

            //setting mockup-data to be read as event when readBody is called
            readBody.mockImplementationOnce(() => Promise.resolve(event))

            //setting mockup for this instance
            email.cleaned.valid(); //setting mockup for cleaned email
            findUser.isFound(); //setting mockup: user is found
            validEmail.valid(); //mockup for valid email
            pwdCompare.invalid(); //mock for when password is incorrect

            //Expected result for if email is incorrect
            await expect(loginLogic({})).resolves.toEqual({ isValid: false, message: 'Incorrect email or password.' });
        })
    });

    describe('Testing when all credentials are passed', () => {
        it('Succeeds when email, password and turnstile key is correct', async () => {
            const event = { turnstileToken: token.valid, email: email.valid, password: pwd.valid };

            readBody.mockImplementationOnce(() => Promise.resolve(event))

            //setting mockdata
            email.cleaned.valid();
            findUser.isFound();
            validEmail.valid();
            pwdCompare.valid();
            token.mocked();

            await expect(loginLogic({})).resolves.toEqual({ isValid: true, message: 'Login successfully.', token: 'testing-mocked-jwt-token' });
        })
    })

    describe('Testing case: credentials are passed but captcha failed', () => {
        it('Succeeds when email, password and turnstile key is correct', async () => {
            const event = { turnstileToken: token.invalid, email: email.valid, password: pwd.valid };

            readBody.mockImplementationOnce(() => Promise.resolve(event))

            //setting that captcha should faild
            $fetch.mockResolvedValue({ success: false })

            await expect(loginLogic({})).resolves.toEqual({ isValid: false, message: "CAPTCHA verification failed." });
        })
    });

    describe('Testing case: credentials are passed but captcha token is empty', () => {
        it('Succeeds when email, password and turnstile key is correct', async () => {
            const event = { turnstileToken: token.empty, email: email.valid, password: pwd.valid };

            readBody.mockImplementationOnce(() => Promise.resolve(event))

            //setting that captcha should faild
            $fetch.mockResolvedValue({ success: false })

            await expect(loginLogic({})).resolves.toEqual({ isValid: false, message: "CAPTCHA verification failed." });
        })
    });

    describe('Testing case: credentials are passed but captcha token is missing', () => {
        it('Succeeds when email, password and turnstile key is correct', async () => {
            const event = { email: email.valid, password: pwd.valid };

            readBody.mockImplementationOnce(() => Promise.resolve(event))

            //setting that captcha should faild
            $fetch.mockResolvedValue({ success: false })

            await expect(loginLogic({})).resolves.toEqual({ isValid: false, message: "CAPTCHA verification failed." });
        })
    });

    describe('Testing case: rate-limiting returned false', () => {
        it('Fails when rate-limiting returns false', async () => {
            const event = { turnstileToken: token.empty, email: email.valid, password: pwd.valid };

            readBody.mockImplementationOnce(() => Promise.resolve(event))

            checkRateLimit.mockResolvedValueOnce({ allowed: false, retryAfter: 60000 })

            //setting that captcha should faild
            $fetch.mockResolvedValue({ success: true })

            await expect(loginLogic({})).resolves.toEqual({
                isValid: false,
                message: `Too many login attempts. Try again in 1 minutes.`,
            });
        })
    })
})