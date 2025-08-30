import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const getApiBase = () => {
        try {
            const env = import.meta.env.VITE_BACKEND_URL
            if (env) {
                const envProto = new URL(env).protocol
                if (envProto === window.location.protocol) return env
            }
        } catch (err) { }
        return '' // use relative path
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const backend = getApiBase();
        const res = await fetch(backend + "/api/token", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok && data.token) {
            sessionStorage.setItem('token', data.token);
            navigate('/private');
        } else {
            alert(data.message || 'login failed')
        }
    }

    return (
        <div className="container mt-5">
            <h3>Login</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Email</label>
                    <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <button className="btn btn-primary">Login</button>
            </form>
        </div>
    )
}