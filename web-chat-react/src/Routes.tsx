import PersonalChat from "./components/PersonalChat";
import {PERSONAL_CHAT, GROUP_CHAT, REGISTER_PAGE, LOGIN_PAGE, PROFILE_PAGE} from "./utils/consts";
import GroupChat from "./components/GroupChat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

export const authRoutes = [
    {
        path: PERSONAL_CHAT,
        component: <PersonalChat userId={} chatName={} chat_type={"Personal"} chat_status={}/>
    },
    {
        path: GROUP_CHAT,
        component: <GroupChat userId={} chatName={} chat_type={"Group"} chat_status={}/>
    },
    // {
    //     path: FRIENDS,
    //     component:
    // }
]

export const publicRoutes = [
    {
        path: LOGIN_PAGE,
        component: <Login />,
    },
    {
        path: REGISTER_PAGE,
        component: <Register />,
    },
    {
        path: PROFILE_PAGE + '/:id',
        component: <Profile />,
    }
]