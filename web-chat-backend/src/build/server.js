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
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const socket_1 = __importDefault(require("./socket"));
const pagesRoutes_1 = __importDefault(require("./pageRoutes/pagesRoutes"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/', pagesRoutes_1.default);
//Функция подключения к БД
function ConnectToDataBase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dbURI = process.env.dbURI;
            yield mongoose_1.default.connect(dbURI);
        }
        catch (err) {
            console.error('Error at connecting to DB', err);
        }
    });
}
const server = (0, http_1.createServer)(app);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Web-chat is running on port ${PORT}`);
});
ConnectToDataBase()
    .then(() => {
    console.log('Successfully connected to DB.');
})
    .catch((err) => {
    console.log('Error at connecting to DB', err);
});
(0, socket_1.default)(server);
