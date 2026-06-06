import { useEffect, useState } from 'react';
import './crearCaracteristica.css';
import './caracteristicaTree.css';
import { useContext} from 'react';
import { AppContext } from '@/AppProvider.jsx';

function Caracteristicas() {

    const [caracteristicas, setCaracteristicas] = useState([]);
    const [raices, setRaices] = useState([]);


    const {
        crearCaracteristicaState,
        setCrearCaracteristicaState
    } = useContext(AppContext);

    const backend = "http://localhost:8080/api/admin";

    function handleList() {


        (async () => {

            const responseRaices = await fetch(
                backend + '/caracteristicas-raiz',
                {
                    headers: {
                        'Authorization':
                            'Bearer ' + localStorage.getItem('token')
                    }
                }
            );

            const responseCaracteristicas = await fetch(
                backend + '/caracteristicas',
                {
                    headers: {
                        'Authorization':
                            'Bearer ' + localStorage.getItem('token')
                    }
                }
            );

            if (!responseRaices.ok || !responseCaracteristicas.ok) {
                alert("Error cargando características");
                return;
            }

            setRaices(await responseRaices.json());
            setCaracteristicas(await responseCaracteristicas.json());

        })();
    }

    useEffect(() => {
        handleList();
    }, []);

    function handleCrear(e) {

        e.preventDefault();

        const request = new Request(
            backend + '/caracteristicas',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':
                        'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    nombre: crearCaracteristicaState.nombre,
                    padreId:
                        crearCaracteristicaState.idPadre === ''
                            ? null
                            : Number(crearCaracteristicaState.idPadre)
                })
            }
        );

        (async () => {

            const response = await fetch(request);

            if (!response.ok) {
                alert("Error: " + response.status);
                return;
            }

            setCrearCaracteristicaState({
                nombre: '',
                idPadre: ''
            });

            handleList();

        })();
    }

    return (
        <main className="caracteristicas">

            <h2 className="caracteristicas__titulo">
                Características <br/>
            </h2>

            <div className="caracteristicas__contenedor">

                {/* Árbol */}

                <section className="caracteristicas__panel caracteristicas__panel--arbol">

                    <div className="panel panel--verde">

                        <div className="panel__header">
                            <h3>Árbol de características</h3>
                        </div>

                        <div className="panel__contenido">

                            {raices.map(r => (

                                <Nodo
                                    key={r.id}
                                    nodo={r}
                                    onSeleccionar={id =>
                                        setCrearCaracteristicaState(prev => ({
                                            ...prev,
                                            idPadre: String(id)
                                        }))
                                    }
                                    idPadreSeleccionado={crearCaracteristicaState.idPadre}
                                />

                            ))}

                        </div>

                    </div>

                </section>

                {/* Formulario */}

                <section className="caracteristicas__panel">

                    <div className="panel panel--verde">

                        <div className="panel__header">
                            <h3>Agregar característica</h3>
                        </div>

                        <div className="panel__contenido">

                            <form onSubmit={handleCrear}>

                                <div className="formulario__grupo">

                                    <label>
                                        Nombre
                                    </label>

                                    <input
                                        className="formulario__input"
                                        type="text"
                                        value={crearCaracteristicaState.nombre}
                                        onChange={(e) =>
                                            setCrearCaracteristicaState(prev => ({
                                                ...prev,
                                                nombre: e.target.value
                                            }))
                                        }
                                        required
                                    />

                                </div>

                                <div className="formulario__grupo">

                                    <label>
                                        Padre
                                    </label>

                                    <select
                                        className="formulario__input"
                                        value={crearCaracteristicaState.idPadre}
                                        onChange={(e) =>
                                            setCrearCaracteristicaState(prev => ({
                                                ...prev,
                                                idPadre: e.target.value
                                            }))
                                        }
                                    >

                                        <option value="">
                                            (sin padre)
                                        </option>

                                        {caracteristicas.map(c => (

                                            <option
                                                key={c.id}
                                                value={c.id}
                                            >
                                                {c.nombre}
                                            </option>

                                        ))}

                                    </select>

                                </div>

                                <button
                                    className="formulario__boton"
                                    type="submit"
                                >
                                    Crear
                                </button>

                            </form>

                        </div>

                    </div>

                </section>

            </div>

        </main>
    );
}

function Nodo({ nodo, onSeleccionar, idPadreSeleccionado }) {

    const tieneHijos =
        nodo.caracteristicas &&
        nodo.caracteristicas.length > 0;

    return (
        <div className="caracteristica-nodo">

            <details
                className="caracteristica-nodo__detalle"
                open
            >

                <summary className="caracteristica-nodo__resumen">

                    <span
                        className={
                            idPadreSeleccionado === String(nodo.id)
                                ? "caracteristica-nodo__nombre seleccionado"
                                : "caracteristica-nodo__nombre"
                        }
                        onClick={() => onSeleccionar(nodo.id)}
                    >
                        {nodo.nombre}
                    </span>

                </summary>

                {tieneHijos && (

                    <div className="caracteristica-nodo__hijos">

                        {nodo.caracteristicas.map(hijo => (

                            <Nodo
                                key={hijo.id}
                                nodo={hijo}
                                onSeleccionar={onSeleccionar}
                                idPadreSeleccionado={idPadreSeleccionado}
                            />

                        ))}

                    </div>

                )}

            </details>

        </div>
    );
}

export default Caracteristicas;