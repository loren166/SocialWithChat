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
const express_1 = __importDefault(require("express"));
const db_save_1 = require("../DB/db_save");
const chatModels_1 = require("../models/chatModels");
const authConfig_1 = __importDefault(require("../auth-strategy/authConfig"));
const mongoose_1 = __importDefault(require("mongoose"));
const pageRouter = express_1.default.Router();
//Запрос с клиента на сервер для регистрации нового пользователя
pageRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email } = req.body;
        const existingUser = yield chatModels_1.UserModel.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }
        // Создаем нового пользователя
        const newUser = yield (0, db_save_1.SaveUser)(username, password, email);
        authConfig_1.default.serializeUser((user, done) => {
            done(null, user._id);
        });
        authConfig_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const user = yield chatModels_1.UserModel.findById(id);
                done(null, user);
            }
            catch (err) {
                done(err);
            }
        }));
        authConfig_1.default.authenticate('local', {
            session: false,
        })(req, res, () => {
            return res.status(201).json({ message: 'User registered and logged in successfully!',
                user: newUser,
                password: password });
        });
    }
    catch (err) {
        console.log('Error at registering user', err);
        res.status(500).send('Internal error at user');
    }
}));
pageRouter.get(`/api/users`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.query;
        const regex = new RegExp(username, 'i');
        const findUser = yield chatModels_1.UserModel.find({ username: { $regex: regex } });
        if (!findUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(findUser);
    }
    catch (err) {
        console.error('Failed to fetch user', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
pageRouter.get('/api/chats/personalchat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = new mongoose_1.default.Types.ObjectId(req.query.userId);
        const chats = yield chatModels_1.ChatModel.find({ users: userId, chat_type: 'personal' });
        res.status(200).json(chats);
    }
    catch (err) {
        console.error('Error fetching personal chats:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
pageRouter.get('/api/chats/groupchat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = new mongoose_1.default.Types.ObjectId(req.query.userId);
        const chats = yield chatModels_1.ChatModel.find({ users: userId, chat_type: 'group' });
        res.status(200).json(chats);
    }
    catch (err) {
        console.error('Error fetching personal chats:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
pageRouter.post('/login', (req, res, next) => {
    authConfig_1.default.serializeUser((user, done) => {
        done(null, user._id);
    });
    authConfig_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield chatModels_1.UserModel.findById(id);
            done(null, user);
        }
        catch (err) {
            done(err);
        }
    }));
    authConfig_1.default.authenticate('local', (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error.' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed.' });
        }
        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Internal server error at login.' });
            }
            return res.status(200).json({ message: 'Authentication successful.', user });
        });
    })(req, res, next);
});
exports.default = pageRouter;
