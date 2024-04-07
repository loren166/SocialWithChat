"use strict";
// import passport from "passport";
// import {Strategy as LocalStrategy} from "passport-local";
// import { SaveUserModel } from "../models/chatModels";
//
// passport.use(new LocalStrategy(
//     async (username, password, done) => {
//         try {
//             const User = await SaveUserModel.findOne({username: username})
//             if (!User) {
//                 return done(null, false, {message: 'Incorrect username.'})
//             }
//             const ValidatePassword = await User.isValidPassword(password)
//             if (!ValidatePassword) {
//                 return done(null, false, {message: 'Incorrect password'})
//             }
//         } catch (err) {
//
//         }
//     }
// ))
