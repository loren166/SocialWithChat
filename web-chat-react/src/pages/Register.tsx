import React, {useState} from 'react';

const Register = () => {
    const [data, setData] = useState({
        login: '',
        password: '',
        confirmPassword: ''
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (data.trim !== '') {

        }
    }
    return (
        <div>
            
        </div>
    );
};

export default Register;