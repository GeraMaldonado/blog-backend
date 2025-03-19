"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
const users_model_1 = require("../src/users/users.model");
const auth_model_1 = require("../src/auth/auth.model");
const app = (0, app_1.createApp)({ userModel: users_model_1.UserModel, authModel: auth_model_1.AuthModel });
const url = '/api/users';
const user = { name: 'Gerardo Maldonado', password: 'passwordSeguro123', email: 'gmaldonadofelix@gmail.com', username: 'tHOwl953' };
let id;
let authToken;
describe('User Endopints', () => {
    describe('GET All users', () => {
        it(`GET ${url} should return a list of users`, () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).get(url);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            response.body.forEach((user) => {
                expect(user).toHaveProperty('username');
                expect(user).not.toHaveProperty('password');
                expect(user).toHaveProperty('email');
            });
        }));
    });
    describe('POST user', () => {
        it(`POST ${url} should create a user`, () => __awaiter(void 0, void 0, void 0, function* () {
            const newUser = Object.assign({}, user);
            const response = yield (0, supertest_1.default)(app).post(url).send(newUser);
            id = response.body.result;
            expect(response.status).toBe(201);
            expect(typeof response.body.result).toBe('string');
        }));
        it(`POST ${url} should fail for repeated user`, () => __awaiter(void 0, void 0, void 0, function* () {
            const newUser = Object.assign(Object.assign({}, user), { email: 'gmaldonadofelix@hotmail.com', username: 'MadMax' });
            const response = yield (0, supertest_1.default)(app).post(url).send(newUser);
            expect(response.status).toBe(409);
            expect(response.body).toEqual({ type: 'ConflictError', message: 'username already in use' });
        }));
        it(`POST ${url} should fail for repeated email`, () => __awaiter(void 0, void 0, void 0, function* () {
            const newUser = Object.assign(Object.assign({}, user), { username: 'Owl' });
            const response = yield (0, supertest_1.default)(app).post(url).send(newUser);
            expect(response.status).toBe(409);
            expect(response.body).toEqual({ type: 'ConflictError', message: 'email already in use' });
        }));
        it(`POST ${url} should fail for field empty`, () => __awaiter(void 0, void 0, void 0, function* () {
            const newUser = Object.assign(Object.assign({}, user), { name: '' });
            const response = yield (0, supertest_1.default)(app).post(url).send(newUser);
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ type: 'ValidationError', message: 'required: name' });
        }));
    });
    describe('GET user by id', () => {
        it(`GET ${url}/:id should return a user by id`, () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).get(`${url}/${id}`);
            expect(response.status).toBe(200);
            expect(response.body.result).toHaveProperty('username');
            expect(response.body.result).toHaveProperty('email');
            expect(response.body.result).not.toHaveProperty('password');
        }));
        it(`GET ${url}/:id should fail for non-existent id`, () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).get(`${url}/28`);
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ type: 'NotFoundError', message: 'user not found' });
        }));
    });
    describe('PATCH user by id', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            const loginResponse = yield (0, supertest_1.default)(app).post('/api/auth/login').send({ email: user.email, password: user.password });
            const cookies = Array.isArray(loginResponse.header['set-cookie']) ? loginResponse.header['set-cookie'] : [loginResponse.header['set-cookie'] || ''];
            authToken = cookies.find((cookie) => cookie.includes('access_token')) || '';
        }));
        it(`PATCH ${url}/:id should modify the user`, () => __awaiter(void 0, void 0, void 0, function* () {
            const oldUser = yield (0, supertest_1.default)(app).get(`${url}/${id}`);
            const response = yield (0, supertest_1.default)(app).patch(`${url}/${id}`).set('Cookie', authToken).send({ name: 'Gerardo' });
            const modifiedUser = yield (0, supertest_1.default)(app).get(`${url}/${id}`);
            expect(response.status).toBe(200);
            expect(modifiedUser.body.result.username).toBe(oldUser.body.result.username);
            expect(modifiedUser.body.result.id).toBe(oldUser.body.result.id);
            expect(modifiedUser.body.result.name).not.toBe(oldUser.body.result.name);
            expect(modifiedUser.body.result.email).toBe(oldUser.body.result.email);
        }));
        it(`PATCH ${url}/:id should fail for not having authentication`, () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).patch(`${url}/${id}`).send({ email: 'gmaldonadofelix@hotmail.com' });
            expect(response.status).toBe(401);
            expect(response.body).toEqual({ type: 'UnauthorizedError', message: 'Token not provided' });
        }));
        it(`PATCH ${url}/:id should fail due to auth mismatch`, () => __awaiter(void 0, void 0, void 0, function* () {
            const oterID = 'otherID';
            const response = yield (0, supertest_1.default)(app).patch(`${url}/${oterID}`).set('Cookie', authToken).send({ email: 'gmaldonadofelix@hotmail.com' });
            expect(response.status).toBe(403);
            expect(response.body).toEqual({ type: 'ForbiddenError', message: 'You do not have permission to modify this resource' });
        }));
        it(`PATCH ${url}/:id should fail for repeated user`, () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).patch(`${url}/${id}`).set('Cookie', authToken).send({ username: 'MadMax' });
            expect(response.status).toBe(409);
            expect(response.body).toEqual({ type: 'ConflictError', message: 'username already in use' });
        }));
        it(`PATCH ${url}/:id should fail for repeated email`, () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).patch(`${url}/${id}`).set('Cookie', authToken).send({ email: 'mrockatansky@email.com' });
            expect(response.status).toBe(409);
            expect(response.body).toEqual({ type: 'ConflictError', message: 'email already in use' });
        }));
        it(`PATCH ${url}/:id should fail for field empty`, () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).patch(`${url}/${id}`).set('Cookie', authToken).send({ email: ' ' });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ type: 'ValidationError', message: 'required: email' });
        }));
    });
    describe('DELETE user by id', () => {
        it(`DELETE ${url}/: should deleted the user`, () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).delete(`${url}/${id}`).set('Cookie', authToken);
            const userDeleted = yield (0, supertest_1.default)(app).get(`${url}/${id}`);
            expect(response.status).toBe(200);
            expect(userDeleted.body).toEqual({ type: 'NotFoundError', message: 'user not found' });
        }));
        it(`DELETE ${url}/:id should fail for not having authentication`, () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).delete(`${url}/${id}`);
            expect(response.status).toBe(401);
            expect(response.body).toEqual({ type: 'UnauthorizedError', message: 'Token not provided' });
        }));
        it(`DELETE ${url}/: should fail due to auth mismatch`, () => __awaiter(void 0, void 0, void 0, function* () {
            id = 'otherID';
            const response = yield (0, supertest_1.default)(app).delete(`${url}/${id}`).set('Cookie', authToken);
            expect(response.status).toBe(403);
            expect(response.body).toEqual({ type: 'ForbiddenError', message: 'You do not have permission to modify this resource' });
        }));
    });
});
