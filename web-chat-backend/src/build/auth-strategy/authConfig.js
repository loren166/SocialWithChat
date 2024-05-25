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
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const chatModels_1 = require("../models/chatModels");
passport_1.default.use(new passport_local_1.Strategy((username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const FindUser = yield chatModels_1.UserModel.findOne({ username: username });
        if (!FindUser) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        const ValidatePassword = yield bcrypt_1.default.compare(password, FindUser.password);
        if (!ValidatePassword) {
            return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, FindUser);
    }
    catch (err) {
        return done(err);
    }
})));
exports.default = passport_1.default;
