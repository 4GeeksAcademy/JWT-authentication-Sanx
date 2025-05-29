import React, { useEffect } from "react"
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"; 

export const Home = () => {

	const { store, actions } = useGlobalReducer();

	useEffect(() => {
        
        if (store.token) {
            actions.getMessage();
        }
    }, [store.token]); 
    return (
        <div className="text-center mt-5 container">
            <h1 className="display-4 mb-4">Bienvenido a tu Aplicación</h1>
            <p className="lead">Autenticación JWT con Flask y React</p>
            <div className="d-grid gap-2 col-md-6 mx-auto mt-4">
                {!store.token ? ( 
                    <>
                        <Link to="/login" className="btn btn-primary btn-lg">
                            Iniciar Sesión
                        </Link>
                        <Link to="/signup" className="btn btn-success btn-lg">
                            Registrarse
                        </Link>
                    </>
                ) : ( 
                    <>
                        <Link to="/private" className="btn btn-info btn-lg">
                            Ir a Página Privada
                        </Link>
                        <button
                            onClick={() => actions.removeToken()} 
                            className="btn btn-warning btn-lg"
                        >
                            Cerrar Sesión
                        </button>
                    </>
                )}
            </div>
            {store.message && ( 
                <div className={`alert mt-4 ${store.message.includes("Error") ? "alert-danger" : "alert-success"}`} role="alert">
                    {store.message}
                </div>
            )}
        </div>
    );
};