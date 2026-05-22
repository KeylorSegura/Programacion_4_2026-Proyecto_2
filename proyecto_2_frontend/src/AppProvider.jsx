import { createContext, useState } from 'react';

const AppContext = createContext();

function AppProvider(props){

    const [busquedaPuestosState, setBusquedaPuestosState] = useState({
        caracteristicasRaiz: [],
        caracteristicasSeleccionadas: [],
        puestos: []
    });

    const [oferenteState, setOferenteState] = useState({

        oferente: {

            nombreUsuario: "",
            clave: "",
            nombre: "",
            primerApellido: "",
            nacionalidad: "",
            telefono: "",
            correoElectronico: "",
            lugarResidencia: ""

        },

        error: ""

    });

    const [empresaState, setEmpresaState] = useState({

        empresa: {
            nombreUsuario: "",
            clave: "",
            nombre: "",
            localizacion: "",
            correoElectronico: "",
            telefono: "",
            descripcion: ""
        },

        error: ""

    });

    return(
        <AppContext.Provider value={{
            oferenteState,
            setOferenteState,

            empresaState,
            setEmpresaState,

            busquedaPuestosState,
            setBusquedaPuestosState

        }}>
            {props.children}
        </AppContext.Provider>
    );
}

export { AppContext, AppProvider };