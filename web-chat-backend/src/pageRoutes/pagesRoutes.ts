import express, {Request, Response} from "express";
import {SaveUser} from "../DB/db_save";
import {UserModel} from "../models/chatModels";
import passport from "../auth-strategy/authConfig";

const pageRouter = express.Router()

//Запрос с клиента на сервер для регистрации нового пользователя
pageRouter.post('/register', async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body
        const existingUser = await UserModel.findOne({username: username})
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