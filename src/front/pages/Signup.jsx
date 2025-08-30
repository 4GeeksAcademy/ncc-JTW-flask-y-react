import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
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
        const res = await fetch(backend + "/api/signup", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (res.ok) navigate('/login');
        else alert('signup failed')
    }

    return (
        <div className="container mt-5">
            <h3>Signup</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Email</label>
                    <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <button className="btn btn-primary">Signup</button>
            </form>
        </div>
    )
}