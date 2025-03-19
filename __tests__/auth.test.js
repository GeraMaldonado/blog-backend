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
const url = '/api/auth';
const app = (0, app_1.createApp)({ userModel: users_model_1.UserModel, authModel: auth_model_1.AuthModel });
let refreshToken;
describe('Auth Endpoints', () => {
    describe('POST login', () => {
        it(`POST ${url}/login should fail for wrong user`, () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).post(`${url}/login`).send({ email: 'mrockatansky@email.com', password: 'password13' });
            expect(response.status).toBe(401);
            expect(response.body).toEqual({ type: 'UnauthorizedError', message: 'Invalid email or password' });
        }));
        it(`POST ${url}/login should authenticate a user `, () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).post(`${url}/login`).send({ email: 'mrockatansky@email.com', password: 'password123' });
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Login successful' });
            expect(response.headers['set-cookie']).toBeDefined();
            refreshToken = Array.isArray(response.header['set-cookie'])
                ? response.header['set-cookie'].find((cookie) => cookie.includes('refresh_token'))
                : response.header['set-cookie'];
        }));
    });
    describe('POST refresh', () => {
        it(`POST ${url}/refresh should efresh the acces token`, () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).post(`${url}/refresh`).set('Cookie', refreshToken);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Token refreshed successfully' });
        }));
        it(`POST ${url}/refresh should fail for token mismatch`, () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).post(`${url}/refresh`);
            expect(response.status).toBe(401);
            expect(response.body).toEqual({ type: 'UnauthorizedError', message: 'Refresh token not provided' });
        }));
    });
    describe('POST logout', () => {
        it(`POST ${url}/logout should delete the user`, () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).post(`${url}/logout`);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Logout successful');
        }));
    });
});
