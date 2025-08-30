import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) return navigate('/login');

        const load = async () => {
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
            const backend = getApiBase();
            const res = await fetch(backend + '/api/private', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            if (!res.ok) return navigate('/login');
            const data = await res.json();
            setMessage(data.message);
        }
        load();
    }, [])

    return (
        <div className="container mt-5">
            <h3>Private</h3>
            <div className="alert alert-success">{message}</div>
        </div>
    )
}