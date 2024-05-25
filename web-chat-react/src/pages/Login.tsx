import axios from "axios";
import React, { useState } from 'react';
import { useNavigate } from "react-router";

const Login = () => {
    const [data, setData] = useState({
        login: '',
        password: ''
    })

    const history = useNavigate();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target
        setData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const sendData = await axios.post('http://localhost:3000/login', {
                username: data.login,
                password: data.password,
            });
            if (!sendData.data.message) {
                console.log('Some data was wasted.')
            } else {
                const responseData = await sendData.data
                if (responseData.message === 'Authentication successful.') {
                    localStorage.setItem('userId', responseData.user._id.toString())
                    history('/Chat')
                }
            }
        } catch (err) {
            console.log(err)
            throw new Error('Failed to authenticate user')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Login:
                <input
                    type='text'
                    name='login'
                    value={data.login}
                    onChange={handleChange}/>
            </label>
            <label>
                Password:
                <input
                    type='password'
                    name='password'
                    value={data.password}
                    onChange={handleChange}/>
            </label>
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;