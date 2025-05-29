import { useContext, useReducer, createContext, useRef, useEffect } from "react"; // Añadido useRef y useEffect
import { initialStore, storeReducer, getActions } from "../store";

const StoreContext = createContext();


export function StoreProvider({ children }) {
    const [store, dispatch] = useReducer(storeReducer, initialStore());
    const actionsRef = useRef(getActions(dispatch, () => store));
    useEffect(() => {
        actionsRef.current.syncSessionStorage();
    }, []);

    return (
        <StoreContext.Provider value={{ store, actions: actionsRef.current }}>
            {children}
        </StoreContext.Provider>
    );
}

export default function useGlobalReducer() {
    const { store, actions } = useContext(StoreContext);
    return { store, actions }; 
}