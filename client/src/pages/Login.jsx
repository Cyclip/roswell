import React, {
    useState,
    useContext,
    useReducer
} from "react";

import UserContext from "../contexts/UserContext";

import {
    login
} from "../services/auth";

import toast from 'react-hot-toast';

import "../styles/Login.css";

import Loading from "../assets/loading.svg";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [_, forceUpdate] = useReducer(x => x + 1, 0);

    const {
        setUser
    } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);
        // force rerender
        forceUpdate();

        const resp = await login(username, password);

        // if success
        if (resp.success) {
            setUser((prevUser) => {
                return {
                    ...prevUser,
                    isLoggedIn: true,
                    username: username,
                    token: resp.token,
                    profilePicture: null,
                }
            });

            // set localstorage
            localStorage.setItem("user", JSON.stringify({
                isLoggedIn: true,
                username: username,
                token: resp.token,
                profilePicture: null,
            }));

            loginSuccess();
        } else {
            console.log("auth failed", resp);
            toast.error(resp.error, {
                duration: 3000,
                position: 'bottom-right',
                icon: '❌',
            });
        }

        setTimeout(() => {
            setIsSubmitting(false);
            forceUpdate();
        }, 1000);
    }

    const loginSuccess = () => {
        toast.success(`Login successful! Redirecting..`, {
            duration: 3000,
            position: 'bottom-right',
            icon: '✅',
        });

        setTimeout(() => {
            window.location.href = "/feed";
        }, 1000);
    }

    const submitBtn = (
        <button type="submit"
            disabled={isSubmitting}
            className={isSubmitting ? "login__button btn-primary disabled" : "login__button btn-primary"}
        >Login
            {/* <img src={Loading} alt="loading"
                className={
                    "login__loading" + (isSubmitting ? " login__loading--active" : "")
                }
            /> */}
        </button>
    );

    return (
        <div className="login">
            <div className="login__container">
                <h1 className="login__title">Welcome back!</h1>
                <p className="login__text">Login into your account here.</p>
                <form className="login__form" onSubmit={handleSubmit}>
                    <div className="formgroup">
                        <label className="login__label">Username</label>
                        <input
                            className="login__input"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    
                    <div className="formgroup">
                        <label className="login__label">Password</label>
                        <input
                            className="login__input"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {submitBtn}
                </form>

                <br />
                <p className="login__text">Don't have an account? <a href="/register">Register</a></p>
            </div>
        </div>
    )

}

export default Login;