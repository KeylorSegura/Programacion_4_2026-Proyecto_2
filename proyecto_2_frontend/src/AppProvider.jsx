import { createContext, useState } from 'react';

const AppContext = createContext();

function AppProvider(props){

    const [busquedaPuestosState, setBusquedaPuestosState] = useState({
        caracteristicasRaiz: [],
        caracteristicasSeleccionadas: [],
        puestos: []
    });

    return(
        <AppContext.Provider value={{
            busquedaPuestosState,
            setBusquedaPuestosState

        }}>
            {props.children}
        </AppContext.Provider>
    );
}

export { AppContext, AppProvider };