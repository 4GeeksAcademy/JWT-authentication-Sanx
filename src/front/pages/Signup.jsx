import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); 
    const [error, setError] = useState(null);
    const { actions } = useGlobalReducer();

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        console.log("Intentando registrar usuario:", email, password);
        setError(null);

        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await resp.json();

            if (!resp.ok) {
                console.error("Error en el registro:", data.msg || resp.statusText);
                setError(data.msg || "Error al registrar usuario. ¿Ya existe el email?");
                return;
            }

            setError("¡Usuario registrado con éxito! Ahora inicia sesión.");
            navigate("/login"); 

        } catch (error) {
            console.error("Error de red al registrar usuario:", error);
            setError("Error de conexión al servidor.");
        }
    };

    return (
        <div className="text-center mt-5 container">
            <h1 className="mb-4">Registrarse</h1>
            <form onSubmit={handleSubmit} className="col-md-6 mx-auto">
                <div className="mb-3 text-start">
                    <label htmlFor="registerEmail" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="registerEmail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3 text-start">
                    <label htmlFor="registerPassword" className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        id="registerPassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success btn-lg w-100">Registrarme</button>
            </form>
        </div>
    );
};