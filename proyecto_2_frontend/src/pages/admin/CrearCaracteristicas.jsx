import { useEffect, useState } from 'react';
import './crearCaracteristica.css';
import './caracteristicaTree.css';
import { useContext } from 'react';
import { AppContext } from '@/AppProvider.jsx';

function Caracteristicas() {

    const [caracteristicas, setCaracteristicas] = useState([]);
    const [raices, setRaices] = useState([]);
    const [nodosAbiertos, setNodosAbiertos] = useState(new Set());

    const {
        crearCaracteristicaState,
        setCrearCaracteristicaState
    } = useContext(AppContext);

    const backend = "http://localhost:8080/api/admin";


    function obtenerAncestros(nodos, targetId, ancestros) {
        for (const nodo of nodos) {
            if (nodo.id === targetId) return true;
            if (nodo.caracteristicas?.length) {
                const encontrado = obtenerAncestros(nodo.caracteristicas, targetId, ancestros);
                if (encontrado) {
                    ancestros.add(nodo.id);
                    return true;
                }
            }
        }
        return false;
    }

    function toggleNodo(id) {
        setNodosAbiertos(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    function handleList() {
        (async () => {
            const responseRaices = await fetch(
                backend + '/caracteristicas-raiz',
                { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } }
            );
            const responseCaracteristicas = await fetch(
                backend + '/caracteristicas',
                { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } }
            );

            if (!responseRaices.ok || !responseCaracteristicas.ok) {
                alert("Error cargando características / No tienes permisos");
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

        const padreId = crearCaracteristicaState.idPadre === ''
            ? null
            : Number(crearCaracteristicaState.idPadre);

        const request = new Request(
            backend + '/caracteristicas',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    nombre: crearCaracteristicaState.nombre,
                    padreId: padreId
                })
            }
        );

        (async () => {
            const response = await fetch(request);

            if (!response.ok) {
                alert("Error: " + response.status);
                return;
            }

            setCrearCaracteristicaState({ nombre: '', idPadre: '' });

            // Abre el padre y todos sus ancestros para que el nuevo nodo sea visible
            if (padreId !== null) {
                setNodosAbiertos(prev => {
                    const nuevos = new Set(prev);
                    nuevos.add(padreId);
                    const ancestros = new Set();
                    obtenerAncestros(raices, padreId, ancestros);
                    ancestros.forEach(id => nuevos.add(id));
                    return nuevos;
                });
            }

            handleList();
        })();
    }

    return (
        <main className="caracteristicas">

            <h2 className="caracteristicas__titulo">
                Características
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
                                    nodosAbiertos={nodosAbiertos}
                                    onToggle={toggleNodo}
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
                                    <label>Nombre</label>
                                    <input
                                        className="formulario__input"
                                        type="text"
                                        value={crearCaracteristicaState.nombre}
                                        onChange={e =>
                                            setCrearCaracteristicaState(prev => ({
                                                ...prev,
                                                nombre: e.target.value
                                            }))
                                        }
                                        required
                                    />
                                </div>

                                <div className="formulario__grupo">
                                    <label>Padre</label>
                                    <select
                                        className="formulario__input"
                                        value={crearCaracteristicaState.idPadre}
                                        onChange={e =>
                                            setCrearCaracteristicaState(prev => ({
                                                ...prev,
                                                idPadre: e.target.value
                                            }))
                                        }
                                    >
                                        <option value="">(sin padre)</option>
                                        {caracteristicas.map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button className="formulario__boton" type="submit">
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

function Nodo({ nodo, onSeleccionar, idPadreSeleccionado, nodosAbiertos, onToggle }) {

    const tieneHijos = nodo.caracteristicas?.length > 0;
    const abierto = nodosAbiertos.has(nodo.id);
    const seleccionado = idPadreSeleccionado === String(nodo.id);

    return (
        <div className="caracteristica-nodo">
            <div className="caracteristica-nodo__detalle">

                <div className="caracteristica-nodo__resumen">

                    {/* Flecha de toggle*/}
                    <span
                        className={`caracteristica-nodo__toggle ${!tieneHijos ? 'caracteristica-nodo__toggle--vacio' : ''}`}
                        onClick={() => tieneHijos && onToggle(nodo.id)}
                    >
                        {tieneHijos ? (abierto ? '▼' : '▶') : ''}
                    </span>

                    <span
                        className={seleccionado
                            ? "caracteristica-nodo__nombre seleccionado"
                            : "caracteristica-nodo__nombre"
                        }
                        onClick={() => onSeleccionar(nodo.id)}
                    >
                        {nodo.nombre}
                    </span>

                </div>

                {tieneHijos && abierto && (
                    <div className="caracteristica-nodo__hijos">
                        {nodo.caracteristicas.map(hijo => (
                            <Nodo
                                key={hijo.id}
                                nodo={hijo}
                                onSeleccionar={onSeleccionar}
                                idPadreSeleccionado={idPadreSeleccionado}
                                nodosAbiertos={nodosAbiertos}
                                onToggle={onToggle}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default Caracteristicas;