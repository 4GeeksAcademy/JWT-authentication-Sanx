const initialState = {
    token: null,
    message: null
};

// 2. Define la función reducer que manejará los cambios de estado
//    Recibe el estado actual y una "acción" y devuelve el nuevo estado
function storeReducer(state, action) {
    switch (action.type) {
        case "SET_TOKEN":
            // Guarda el token en sessionStorage directamente aquí en el reducer
            localStorage.setItem("token", action.payload);
            return { ...state, token: action.payload };
        case "REMOVE_TOKEN":
            // Elimina el token de sessionStorage directamente aquí en el reducer
            localStorage.removeItem("token");
            return { ...state, token: null };
        case "SET_MESSAGE":
            return { ...state, message: action.payload };
        case "SYNC_SESSION_STORAGE":
            // Acción para sincronizar el token al cargar la app
            const token = localStorage.getItem("token");
            return { ...state, token: token || null }; // Si no hay token, establece null
        default:
            return state; // Devuelve el estado sin cambios si la acción no es reconocida
    }
}

// 3. Define la función `getActions` que creará las funciones de acción.
//    Recibe `dispatch` (para enviar acciones al reducer) y `getStore` (para acceder al estado actual).
export const getActions = (dispatch, getStore) => {
    return {
        // Función para sincronizar el token al inicio de la aplicación
        syncSessionStorage: () => {
            dispatch({ type: "SYNC_SESSION_STORAGE" });
        },
        // Función para establecer el token
        setToken: (token) => {
            console.log("Dispatching SET_TOKEN with token:", token);
            dispatch({ type: "SET_TOKEN", payload: token }); // Envía el token como payload
        },
        
        // Función para eliminar el token (cerrar sesión)
        removeToken: () => {
            dispatch({ type: "REMOVE_TOKEN" });
        },
        // Función para obtener un mensaje del backend
        getMessage: async () => {
            const store = getStore(); // Obtiene el estado actual
            const token = localStorage.getItem("token"); 

            if (!token) {
                console.error("No hay token disponible para la petición privada.");
                return { msg: "No autorizado: No hay token" }; // No hay token, salimos
            }
            const url = import.meta.env.VITE_BACKEND_URL + "/api/private";
            console.log("Intentando obtener mensaje del endpoint privado:", url);

            try {
                const resp = await fetch(url, {
                    headers: {
                        "Authorization": "Bearer " + token // Envía el token JWT
                    }
                });

                const data = await resp.json();

                if (!resp.ok) {
                    console.error("Error al obtener mensaje privado:", data.msg || resp.statusText);
                    dispatch({ type: "SET_MESSAGE", payload: data.msg || "Error al cargar el mensaje privado" });
                    if (resp.status === 401 || resp.status === 403) {
                        dispatch({ type: "REMOVE_TOKEN" }); // Eliminar token si no es válido
                    }
                    return false;
                }

                dispatch({ type: "SET_MESSAGE", payload: data.message });
                console.log("Mensaje privado cargado con éxito:", data.message);
                return true;

            } catch (error) {
                console.error("Error de red al obtener mensaje privado:", error);
                dispatch({ type: "SET_MESSAGE", payload: "Error de conexión con el servidor." });
                return false;
            }
        }
    };
};

// 4. Exporta las partes necesarias para useGlobalReducer.jsx
export const initialStore = () => initialState; // Exporta initialStore como función
export { storeReducer }; // Exporta el reducer