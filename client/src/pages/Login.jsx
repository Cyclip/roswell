import React, {
    useState,
    useContext,
    useReducer,
    useEffect
} from "react";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

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
            const newUser = {
                isLoggedIn: true,
                username: resp.user.username,
                token: resp.token,
                profilePicture: resp.user.profilePicture,
                id: resp.user.id,
                email: resp.user.email,
                role: resp.user.role,
                punishment: resp.user.punishment,
            };
            
            setUser(newUser);

            // set localstorage
            localStorage.setItem("user", JSON.stringify(newUser));

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
        toast.success(`Login successful!`, {
            duration: 3000,
            position: 'bottom-right',
            icon: '✅',
        });
        
        navigate("/feed");
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