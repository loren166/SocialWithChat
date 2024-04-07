import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer, Server as HTTPServer } from "http";
import mongoose from "mongoose";
import session from "express-session";
import setUpSocket from "./socket";
import pageRoutes from "./pageRoutes/pagesRoutes";
import passport from "./auth-strategy/authConfig";

dotenv.config();
const app: express.Application = express();
app.use(cors());
app.use(express.json());
app.use(session({
    secret: process.env.SECRET as string,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use('/', pageRoutes);

//Функция подключения к БД
async function ConnectToDataBase () {
    try {
        const dbURI: string | undefined = process.env.dbURI as string;
        await mongoose.connect(dbURI);
    } catch (err) {
        console.error('Error at connecting to DB', err)
    }
}
const server: HTTPServer = createServer(app);
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Web-chat is running on port ${PORT}`)
});

ConnectToDataBase()
    .then(() => {
        console.log('Successfully connected to DB.');
    })
    .catch((err) => {
        console.log('Error at connecting to DB', err)
    })
setUpSocket(server)