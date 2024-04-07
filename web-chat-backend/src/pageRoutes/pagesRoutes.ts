import express, {Request, Response} from "express";
import {SaveCreatedRoom, SaveRoomWithConnectedUser, SaveUser} from "../DB/db_save";
import {SaveUserModel} from "../models/chatModels";
import passport from "../auth-strategy/authConfig";

const pageRouter = express.Router()

//Запрос с клиента на сервер для создания новой комнаты
pageRouter.post('/newroom',  async (req: Request, res: Response) => {
    try {
        const { roomName, owner } = req.body;
        await SaveCreatedRoom(roomName, owner)
        res.status(200).send('New room has been created.')
    } catch (err) {
        console.log('Error at creating room', err)
        res.status(500).send('Internal server at creating room error.')
    }
});

//Запрос на подключение юзера к комнате
pageRouter.post(`/rooms/:roomId`, async (req:Request, res: Response) => {
    try {
        const roomId = req.params.roomId;
        if (roomId) {
            res.send("Room found. Id of room:" + roomId)
        } else {
            res.status(404).send("Room not found. Id of room:" + roomId)
        }
        const { userId } = req.body;
        await SaveRoomWithConnectedUser(roomId, userId)
    } catch (err) {
        console.log('Error at connecting to room', err)
        res.status(500).send('Internal server at connecting to room error.')
    }
});

//Запрос с клиента на сервер для регистрации нового пользователя
pageRouter.post('/register', async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body
        const existingUser = await SaveUserModel.findOne({username: username})
        if (existingUser) {
            return res.status(400).json({message: 'User already exists.'})
        }

        const newUser = await SaveUser(username, password)

        req.login(newUser, (err) => {
            if (err) {
                return res.status(500).json({message: 'Failed to authenticate user.'})
            }
            return res.status(201).json({message: 'User registered successfully!', user: newUser})
        })
    }   catch (err) {
        console.log('Error at registering user', err)
        res.status(500).send('Internal error at user')
    }
});

pageRouter.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true}
    )
);

export default pageRouter;