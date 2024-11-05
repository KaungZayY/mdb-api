import { expect, jest, test } from '@jest/globals';
import userController from "../../../v1/controllers/userController.js";
import { User } from '../../../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


jest.mock('../../../models/User.js');

jest.mock('bcrypt', () => ({
    ...jest.requireActual('bcrypt'),
    hash: jest.fn().mockReturnValue('this_is_mock_hash_password'),
}));

jest.mock('jsonwebtoken');

describe('User Controller', () => {

    let req;
    let res;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('uploadImage', () => {
        test('should return 201 and the file path if file is uploaded successfully', async () => {
            const mockFilePath = '/uploads/test-image.jpg';
            req = {
                file: {
                    path: mockFilePath
                }
            };

            await userController.uploadImage(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith({
                message: 'File uploaded successfully!',
                imageUrl: mockFilePath,
            });
        });

        test('should return 400 if no file is uploaded', async () => {
            req = {
                file: null
            };

            await userController.uploadImage(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                message: `No file uploaded, upload as form-data and key as 'image'`,
            });
        });
    });

    describe('createUser', () => {
        test('should return 400 if required fields are missing', async () => {
            req = {
                body: {}
            };

            await userController.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Required fields: name, profileImageUrl, email, password' });
        });

        test('should return 409 if the required fields present but email already exists', async () => {
            req = {
                body: {
                    name: 'Franky',
                    profileImageUrl: 'http://example.com/my-image.jpg',
                    email: 'franky22@gmail.com',
                    password: '123'
                },
            };

            const mockedExistUser = [
                {
                    _id: 'Ux123',
                    email: 'franky22@gmail.com'
                }
            ];

            User.find = jest.fn().mockResolvedValue(mockedExistUser);

            await userController.createUser(req, res);

            expect(User.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.send).toHaveBeenCalledWith({ message: 'Email already exists' });
        });

        test('should return created user if the required fields present and email already not exists', async () => {
            req = {
                body: {
                    name: 'Franky',
                    profileImageUrl: 'http://example.com/my-image.jpg',
                    email: 'user@gmail.com',
                    password: '123'
                },
            };

            const mockedExistUser = {};

            const mockNewUser = { ...req.body, _id: 'Ux1234' };

            User.find = jest.fn().mockResolvedValue(mockedExistUser);
            User.create = jest.fn().mockResolvedValue(mockNewUser);

            await userController.createUser(req, res);

            expect(User.find).toHaveBeenCalled();
            expect(User.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith(mockNewUser);
        });
    });

    describe('userLogin', () => {
        test('should return 400 if required fields are missing', async () => {
            req = {
                body: {}
            };

            await userController.userLogin(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Required fields: email, password' });
        });

        test('should return 404 if the user does not exists', async () => {
            req = {
                body: {
                    email: 'franky22@gmail.com',
                    password: '123'
                }
            };

            User.findOne = jest.fn().mockResolvedValue(null);

            await userController.userLogin(req, res);

            expect(User.findOne).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ message: 'User not found' });
        });

        test('should return access token and generate token after successful login', async () => {
            req = {
                body: {
                    email: 'franky22@gmail.com',
                    password: '123'
                },
            };

            const mockUser = {
                email: 'franky22@gmail.com',
                password: '123'
            }

            const mockAccessToken = 'mock_access_token';
            const mockRefreshToken = 'mock_refresh_token';
            User.findOne = jest.fn().mockResolvedValue(mockUser);
            bcrypt.compare = jest.fn().mockResolvedValue(true);

            jwt.sign = jest.fn().mockImplementation((payload, secret, options) => {
                if (options.expiresIn === '20m') {
                    return mockAccessToken;
                } else if (options.expiresIn === '30m') {
                    return mockRefreshToken;
                }
            });

            await userController.userLogin(req, res);

            expect(User.findOne).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                AccessToken: mockAccessToken,
                RefreshToken: mockRefreshToken
            });
        });
    });

    describe('userLogout', () => {
        test('should return 400 if refresh token is missing', async () => {
            req.body.token = undefined;
    
            await userController.userLogout(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Refresh token is required' });
        });

        test('should return 400 if refresh token is invalid', async () => {
            req.body.token = 'invalid_mock_token';
            
            await userController.userLogout(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Invalid or missing Refresh Token' });
        });

        test('should logout user and remove the token', async () => {
            req.body.token = "mock_refresh_token";
            await userController.userLogout(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ message: 'Successfully logged out' });
        });
    });

    describe('tokenRefresh', () => {
        test('should return 400 if refresh token is missing', async () => {
            req.body.token = undefined;
    
            await userController.tokenRefresh(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Refresh token is required' });
        });

        test('should return 400 if refresh token is invalid', async () => {
            req.body.token = 'invalid_mock_token';
            
            await userController.tokenRefresh(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Invalid token' });
        });

        test('should use refresh token to generate new pair of access and refresh tokens', async () => {
            req.body.token = "mock_refresh_token";
            const user = { id: 'user123', name: 'John Doe' };
            const newMockAccessToken = 'mock_access_token';
            const newMockRefreshToken = 'mock_refresh_token';

            jwt.verify = jest.fn().mockReturnValue(user);
            jwt.sign = jest.fn().mockImplementation((payload, secret, options) => {
                if (options.expiresIn === '20m') {
                    return newMockAccessToken;
                } else if (options.expiresIn === '30m') {
                    return newMockRefreshToken;
                }
            });
            await userController.tokenRefresh(req, res);

            expect(res.send).toHaveBeenCalledWith({
                AccessToken: newMockAccessToken,
                RefreshToken: newMockRefreshToken
            });
        });
    });
});