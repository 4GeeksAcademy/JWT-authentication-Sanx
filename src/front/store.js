const initialState = {
  token: null,
  message: null,
};

function storeReducer(state, action) {
  switch (action.type) {
    case "SET_TOKEN":
      localStorage.setItem("token", action.payload);
      return { ...state, token: action.payload };
    case "REMOVE_TOKEN":
      localStorage.removeItem("token");
      return { ...state, token: null };
    case "SET_MESSAGE":
      return { ...state, message: action.payload };
    case "SYNC_SESSION_STORAGE":
      const token = localStorage.getItem("token");
      return { ...state, token: token || null };
    default:
      return state;
  }
}

export const getActions = (dispatch, getStore) => {
  return {
    syncSessionStorage: () => {
      dispatch({ type: "SYNC_SESSION_STORAGE" });
    },

    setToken: (token) => {
      console.log("Dispatching SET_TOKEN with token:", token);
      dispatch({ type: "SET_TOKEN", payload: token });
    },

    removeToken: () => {
      dispatch({ type: "REMOVE_TOKEN" });
    },

    getMessage: async () => {
      const store = getStore();
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No hay token disponible para la petición privada.");
        return { msg: "No autorizado: No hay token" };
      }
      const url = import.meta.env.VITE_BACKEND_URL + "/api/private";
      console.log("Intentando obtener mensaje del endpoint privado:", url);

      try {
        const resp = await fetch(url, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const data = await resp.json();

        if (!resp.ok) {
          console.error(
            "Error al obtener mensaje privado:",
            data.msg || resp.statusText
          );
          dispatch({
            type: "SET_MESSAGE",
            payload: data.msg || "Error al cargar el mensaje privado",
          });
          if (resp.status === 401 || resp.status === 403) {
            dispatch({ type: "REMOVE_TOKEN" });
          }
          return false;
        }

        dispatch({ type: "SET_MESSAGE", payload: data.message });
        console.log("Mensaje privado cargado con éxito:", data.message);
        return true;
      } catch (error) {
        console.error("Error de red al obtener mensaje privado:", error);
        dispatch({
          type: "SET_MESSAGE",
          payload: "Error de conexión con el servidor.",
        });
        return false;
      }
    },
  };
};

export const initialStore = () => initialState;
export { storeReducer };
