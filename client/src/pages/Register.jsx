import React, { useState, useContext, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import { register } from "../services/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Loading from "../assets/loading.svg";

import "../styles/Register.css";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const { setUser } = useContext(UserContext);

    // check if user is logged in
    useEffect(() => {
        if (localStorage.getItem("user")) {
            // check if user is logged in
            const user = JSON.parse(localStorage.getItem("user"));
            if (user.isLoggedIn) {
                navigate("/feed");
            }
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        const resp = await register(username, email, password);

        // if success
        if (resp.success) {
            registerSuccess();
        } else {
            setIsSubmitting(false);
            toast.error(resp.error);
        }
    };

    const registerSuccess = () => {
        toast.success("Registered successfully!");
        navigate("/login");
    };

    return (
        <div className="register">
            <div className="register__container">
                <h1>Register</h1>
                <p>
                    Already have an account?{" "}
                    <a href="/login" className="register__link">
                        Login
                    </a>
                </p>
                <form onSubmit={handleSubmit}>
                <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="btn-primary">
                        {isSubmitting ? (
                            <img src={Loading} alt="loading" />
                        ) : (
                            "Register"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;