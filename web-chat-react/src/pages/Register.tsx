import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const [data, setData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: ''
    });

    const navigate = useNavigate();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (data.username.trim() !== '' && data.password.trim() !== '' && data.password === data.confirmPassword && data.email.trim() !== '') {
            try {
                const response = await axios.post('http://localhost:3000/register', {
                    username: data.username,
                    password: data.password,
                    email: data.email
                });

                if (response.data.message) {
                    console.log(response.data.message);
                } else {
                    console.log('Unexpected response from server:', response.data);
                }

                navigate('/Chat');
            } catch (err) {
                console.error('Error registering user:', err);
                if (axios.isAxiosError(err) && err.response) {
                    console.error('Server responded with:', err.response.data);
                }
            }
        } else {
            console.log('Validation failed. Please check your input.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input
                    type="text"
                    name="username"
                    value={data.username}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Email:
                <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Password:
                <input
                    type="password"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                Confirm password:
                <input
                    type="password"
                    name="confirmPassword"
                    value={data.confirmPassword}
                    onChange={handleChange}
                    required
                />
            </label>
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;