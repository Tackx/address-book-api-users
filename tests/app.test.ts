import request from 'supertest';
import app from '../src/app';
import { UsersService } from '../src/services/users.service';
import { describe, expect, test, jest, beforeAll, beforeEach, afterAll, afterEach } from '@jest/globals';

jest.mock('../src/services/users.service');

// Mock UsersService methods
const mockFindOne = UsersService.findOne as jest.MockedFunction<typeof UsersService.findOne>;
const mockCreate = UsersService.create as jest.MockedFunction<typeof UsersService.create>;
const mockLogin = UsersService.login as jest.MockedFunction<typeof UsersService.login>;

const testUser = {
  email: 'test@test.com',
  password: 'testpassword'
};

// beforeAll(async () => {});

// beforeEach(async () => {});

// afterAll(async () => {});

afterEach(async () => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

// Test registration route
describe('POST /', () => {
  test('should specify JSON in the content type header', async () => {
    // findOne mock resolves to false, meaning the user is not registered yet
    mockFindOne.mockResolvedValueOnce(null);
    // create mock returns the successfully created user
    mockCreate.mockResolvedValueOnce({ email: testUser.email, password: testUser.password, token: '123456' });

    const response = await request(app).post('/').send(testUser);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
  });

  describe('given an email and a password', () => {
    test('should respond with a 201 status code if the email is not registered yet', async () => {
      // findOne mock resolves to false, meaning the user is not registered yet
      mockFindOne.mockResolvedValueOnce(null);
      // create mock returns the successfully created user
      mockCreate.mockResolvedValueOnce({ email: testUser.email, password: testUser.password, token: '123456' });

      const response = await request(app).post('/').send(testUser);
      expect(response.statusCode).toBe(201);
    });
    test('response contains a success message, email and a JWT token', async () => {
      // findOne mock resolves to false, meaning the user is not registered yet
      mockFindOne.mockResolvedValueOnce(null);
      // create mock returns the successfully created user
      mockCreate.mockResolvedValueOnce({ email: testUser.email, password: testUser.password, token: '123456' });

      const response = await request(app).post('/').send(testUser);
      expect(response.body.message).toBe('Registration successful');
      expect(response.body.email).toBe(testUser.email);
      expect(response.body.token).toBeDefined();
    });
    test('should respond with a 409 status code if the email is registered already', async () => {
      // findOne mock resolves to a User object, meaning the e-mail is already registered
      mockFindOne.mockResolvedValueOnce(<any>{ email: testUser.email });

      const response = await request(app).post('/').send(testUser);
      expect(response.statusCode).toBe(409);
    });

    // Test login route
    describe('POST /token', () => {
      test('should specify JSON in the content type header', async () => {
        // login mock returns a mock JWT
        mockLogin.mockResolvedValueOnce('123456');

        const response = await request(app).post('/token').send(testUser);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
      });

      describe('given an email and a password', () => {
        test('should respond with a 200 status code if the credentials are correct', async () => {
          // login mock returns a mock JWT
          mockLogin.mockResolvedValueOnce('123456');

          const response = await request(app).post('/token').send(testUser);
          expect(response.statusCode).toBe(200);
        });

        test('response contains a success message, email and a JWT token', async () => {
          // login mock returns a mock JWT
          mockLogin.mockResolvedValueOnce('123456');

          const response = await request(app).post('/token').send(testUser);
          expect(response.body.message).toBe('Login successful');
          expect(response.body.email).toBe(testUser.email);
          expect(response.body.token).toBeDefined();
        });

        test('incorrect credentials receive a 400 status code and the correct error message', async () => {
          // login mock returns false meaning the credentials are incorrect
          mockLogin.mockResolvedValueOnce(false);

          const response = await request(app).post('/token').send(testUser);
          expect(response.statusCode).toBe(400);
          expect(response.body.message).toBe('Invalid credentials');
        });
      });
    });
  });
});
