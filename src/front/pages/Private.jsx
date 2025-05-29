import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const { store, actions } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {

        if (!store.token) {
            console.log("No token found, redirecting to login.");
            navigate("/login");
        } else {
            actions.getMessage();
        }
    }, [store.token, navigate]);

    const handleLogout = () => {
        actions.removeToken();
        navigate("/login");
    };

    return (
        <div className="text-center mt-5 container">
            <h1 className="mb-4">Página Privada</h1>
            {store.message ? (
                <div className={`alert mt-4 ${store.message.includes("Error") ? "alert-danger" : "alert-success"}`} role="alert">
                    {store.message}
                </div>
            ) : (
                <div className="alert alert-info mt-4" role="alert">
                    Cargando mensaje privado...
                </div>
            )}
            <button onClick={handleLogout} className="btn btn-warning btn-lg mt-3">
                Cerrar Sesión
            </button>
        </div>
    );
};