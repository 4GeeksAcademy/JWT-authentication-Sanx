import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { store, actions } = useGlobalReducer();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Intentando iniciar sesión con:", email, password);
        setError(null);

        try {

            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await resp.json();

            if (!resp.ok) {
                console.error("Error en el login:", data.msg || resp.statusText);
                setError(data.msg || "Credenciales inválidas.");
                return;
            }

            actions.setToken(data.access_token);
            console.log("Login exitoso, token:", data.access_token);
            navigate("/private");
        } catch (error) {
            console.error("Error de red al iniciar sesión:", error);
            setError("Error de conexión al servidor.");
        }
    };

    return (
        <div className="text-center mt-5 container">
            <h1 className="mb-4">Iniciar Sesión</h1>
            <form onSubmit={handleSubmit} className="col-md-6 mx-auto">
                <div className="mb-3 text-start">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3 text-start">
                    <label htmlFor="exampleInputPassword1" className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-100">Entrar</button>
            </form>
        </div>
    );
};