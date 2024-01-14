import React, { useState } from 'react';
import './style.css';
import axios from 'axios';

const RegistrationForm = () => {
    const [imageData, setImageData] = useState('');
    const [formData, setFormData] = useState({
        firstName: {
            "name": "",
            "label": "",
            "value": "",
            "type": ""
        },
        lastName: {
            "name": "",
            "label": "",
            "value": "",
            "type": ""
        },
        email: {
            "name": "",
            "label": "",
            "value": "",
            "type": ""
        },
        password: {
            "name": "",
            "label": "",
            "value": "",
            "type": ""
        }
    });

    const handleChange = (e) => {
        const { name, value, type, placeholder } = e.target;
        console.log(formData);
        console.log(e.target)
        setFormData({
            ...formData, [name]: {
                "name": name,
                "label": placeholder,
                "value": value,
                "type": type
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let requestObject = { "userid": "10", "data": formData };
        try {
            const response = await axios.post('http://localhost:3001/submit-form', { ...requestObject });
            console.log('http://localhost:3001' + response.data.url);
            setImageData('http://localhost:3001' + response.data.url);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-body">
                <div className="firstName">
                    <label className="form__label" htmlFor="firstName">First Name </label>
                    <input className="form__input" type="text" name="firstName" value={formData.firstName.value} onChange={handleChange} id="firstName" placeholder="First Name" />
                </div>
                <div className="lastName">
                    <label className="form__label" htmlFor="lastName">Last Name </label>
                    <input type="text" id="lastName" name="lastName" value={formData.lastName.value} className="form__input" onChange={handleChange} placeholder="Last Name" />
                </div>
                <div className="email">
                    <label className="form__label" htmlFor="email">Email </label>
                    <input type="email" id="email" name="email" className="form__input" value={formData.email.value} onChange={handleChange} placeholder="Email" />
                </div>
                <div className="password">
                    <label className="form__label" htmlFor="password">Password </label>
                    <input className="form__input" type="password" name="password" id="password" value={formData.password.value} onChange={handleChange} placeholder="Password" />
                </div>
            </div>
            <button type="submit" className="btn">Submit</button>
            <div>
                {imageData && <img src={imageData} alt="qr-code" />}
            </div>
        </form>
    )
}

export default RegistrationForm