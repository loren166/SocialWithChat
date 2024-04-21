import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import { UserModel } from "../models/chatModels";

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const FindUser = await UserModel.findOne({username: username})
            if (!FindUser) {
                return done(null, false, {message: 'Incorrect username.'})
            }
            const ValidatePassword = await FindUser.isValidPassword(password)
            if (!ValidatePassword) {
                return done(null, false, {message: 'Incorrect password'})
            }
            return done(null, FindUser)
        } catch (err) {
            return done(err)
        }
    }
));

export default passport;