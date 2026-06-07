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

            nombreUsuario: {
                id: "",
                clave: ""
            },

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

            nombreUsuario: {
                id: "",
                clave: ""
            },

            nombre: "",
            localizacion: "",
            correoElectronico: "",
            telefono: "",
            descripcion: ""
        },

        error: ""

    });

    const [habilidadesState, setHabilidadesState] = useState({
        habilidades: [],

        caracteristicasActuales: [],

        ruta: [],

        habilidad: {
            caracteristicaId: "",
            nivel: ""
        }
    });

    const [cvState, setCvState] = useState({

        archivo: null,

        tieneCV: false

    });



    const [crearCaracteristicaState, setCrearCaracteristicaState] = useState({
        nombre: '',
        idPadre: ''
    });


    function resetAppState() {

        setBusquedaPuestosState({
            caracteristicasRaiz: [],
            caracteristicasSeleccionadas: [],
            puestos: []
        });

        setOferenteState({
            oferente: {
                nombreUsuario: {
                    id: "",
                    clave: ""
                },
                nombre: "",
                primerApellido: "",
                nacionalidad: "",
                telefono: "",
                correoElectronico: "",
                lugarResidencia: ""
            },
            error: ""
        });

        setEmpresaState({
            empresa: {
                nombreUsuario: {
                    id: "",
                    clave: ""
                },
                nombre: "",
                localizacion: "",
                correoElectronico: "",
                telefono: "",
                descripcion: ""
            },
            error: ""
        });

        setHabilidadesState({
            habilidades: [],
            caracteristicasActuales: [],
            ruta: [],
            habilidad: {
                caracteristicaId: "",
                nivel: ""
            }
        });

        setCvState({
            archivo: null,
            tieneCV: false
        });

        setCrearCaracteristicaState({
            nombre: '',
            idPadre: ''
        });
    }


    return(
        <AppContext.Provider value={{
            oferenteState,
            setOferenteState,

            empresaState,
            setEmpresaState,

            busquedaPuestosState,
            setBusquedaPuestosState,

            habilidadesState,
            setHabilidadesState,

            cvState,
            setCvState,

            crearCaracteristicaState,
            setCrearCaracteristicaState,

            resetAppState

        }}>
            {props.children}
        </AppContext.Provider>
    );
}

export { AppContext, AppProvider };