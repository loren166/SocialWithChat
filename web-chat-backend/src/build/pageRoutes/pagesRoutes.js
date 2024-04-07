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
const pageRouter = express_1.default.Router();
//Запрос с клиента на сервер для создания новой комнаты
pageRouter.post('/newroom', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomName, owner } = req.body;
        yield (0, db_save_1.SaveCreatedRoom)(roomName, owner);
        res.status(200).send('New room has been created.');
    }
    catch (err) {
        console.log('Error at creating room', err);
        res.status(500).send('Internal server at creating room error.');
    }
}));
//Запрос на подключение юзера к комнате
pageRouter.post(`/rooms/:roomId`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roomId = req.params.roomId;
        if (roomId) {
            res.send("Комната найдена. Id комнаты:" + roomId);
        }
        else {
            res.status(404).send("Комната не найдена. Id комнаты:" + roomId);
        }
        const { userId } = req.body;
        yield (0, db_save_1.SaveRoomWithConnectedUser)(roomId, userId);
    }
    catch (err) {
        console.log('Error at connecting to room', err);
        res.status(500).send('Internal server at connecting to room error.');
    }
}));
//Запрос с клиента на сервер для регистрации нового пользователя
pageRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const existingUser = yield chatModels_1.SaveUserModel.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }
        yield (0, db_save_1.SaveUser)(username, password);
    }
    catch (err) {
        console.log('Error at registering user', err);
        res.status(500).send('Internal error at user');
    }
}));
//     req.login(newUser, (err) => {
//         if (err) {
//             return res.status(500).json({message: 'Failed to authenticate user.'})
//         }
//         return res.status(201).json({message: 'User registered successfully!', user: newUser})
//     })
// }   catch (err) {
//     console.log('Error at registering user', err)
//     res.status(500).send('Internal error at user')
// }
// });
exports.default = pageRouter;
