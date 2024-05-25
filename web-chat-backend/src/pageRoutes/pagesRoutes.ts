import express, {Request, Response, NextFunction} from "express";
import {SaveUser} from "../DB/db_save";
import { ChatModel, UserModel } from "../models/chatModels";
import passport from "../auth-strategy/authConfig";
import mongoose from "mongoose";

const pageRouter = express.Router()

//Запрос с клиента на сервер для регистрации нового пользователя
pageRouter.post('/register', async (req: Request, res: Response) => {
    try {
        const {username, password, email} = req.body
        const existingUser = await UserModel.findOne({username: username})
        if (existingUser) {
            return res.status(400).json({message: 'User already exists.'})
        }

        // Создаем нового пользователя
        const newUser = await SaveUser(username, password, email)
        passport.serializeUser((user: any, done) => {
            done(null, user._id);
        });

        passport.deserializeUser(async (id: string, done) => {
            try {
                const user = await UserModel.findById(id);
                done(null, user);
            } catch (err) {
                done(err);
            }
        });
        passport.authenticate('local', {
            session: false,
        })(req, res, () => {
            return res.status(201).json({message: 'User registered and logged in successfully!',
                user: newUser,
                password: password});
        });

    }   catch (err) {
        console.log('Error at registering user', err)
        res.status(500).send('Internal error at user')
    }
});

pageRouter.get(`/api/users`, async (req: Request, res: Response) => {
    try {
        const {username} = req.query
        const regex = new RegExp(username as string, 'i')
        const findUser = await UserModel.find({username: {$regex: regex}})
        if (!findUser) {
            return res.status(404).json({error: 'User not found'})
        }
        res.json(findUser)
    } catch (err) {
        console.error('Failed to fetch user', err)
        res.status(500).json({error: 'Internal server error'})
    }
})

pageRouter.get('/api/chats/personalchat', async (req: Request, res: Response) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.query.userId as string);
        const chats = await ChatModel.find({ users: userId, chat_type: 'personal' });
        res.status(200).json(chats);
    } catch (err) {
        console.error('Error fetching personal chats:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

pageRouter.get('/api/chats/groupchat', async (req: Request, res: Response) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.query.userId as string);
        const chats = await ChatModel.find({ users: userId, chat_type: 'group' });
        res.status(200).json(chats);
    } catch (err) {
        console.error('Error fetching personal chats:', err)
        res.status(500).json({error: 'Internal server error'})
    }
})

pageRouter.post('/login', (req: Request, res: Response, next: NextFunction) => {
    passport.serializeUser((user: any, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id: string, done) => {
        try {
            const user = await UserModel.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
    passport.authenticate('local', (err: Error | null, user: any) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error.' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed.' });
        }
        req.login(user, (err: Error | null) => {
            if (err) {
                return res.status(500).json({ message: 'Internal server error at login.' });
            }
            return res.status(200).json({ message: 'Authentication successful.', user });
        });
    })(req, res, next);
});

export default pageRouter;