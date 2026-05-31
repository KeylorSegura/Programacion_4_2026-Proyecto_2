import { useContext, useEffect } from "react";
import { AppContext } from "@/AppProvider";

function BuscarPuestos() {

    const {
        busquedaPuestosState,
        setBusquedaPuestosState
    } = useContext(AppContext);

    const backend = "http://localhost:8080/api/publico";


    async function cargarCaracteristicas() {

        const response = await fetch(
            backend + "/caracteristicas"
        );

        if (!response.ok) {
            alert("Error: " + response.status);
            return;
        }

        const data = await response.json();

        setBusquedaPuestosState({
            ...busquedaPuestosState,
            caracteristicasRaiz: data
        });
    }

    useEffect(() => {

        if (busquedaPuestosState.caracteristicasRaiz.length === 0) {
            cargarCaracteristicas();
        }

    }, []);

    async function handleFiltrar() {

        const response = await fetch(
            backend + "/filtrar",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    busquedaPuestosState
                        .caracteristicasSeleccionadas
                )
            }
        );

        if (!response.ok) {
            alert("Error: " + response.status);
            return;
        }

        const puestos = await response.json();

        setBusquedaPuestosState({
            ...busquedaPuestosState,
            puestos: puestos
        });
    }

    function handleCheckbox(id, checked) {

        let seleccionadas = [
            ...busquedaPuestosState
                .caracteristicasSeleccionadas
        ];

        if (checked) {

            if (!seleccionadas.includes(id)) {
                seleccionadas.push(id);
            }

        } else {

            seleccionadas =
                seleccionadas.filter(x => x !== id);

        }

        setBusquedaPuestosState({
            ...busquedaPuestosState,
            caracteristicasSeleccionadas: seleccionadas
        });
    }

    return (
        <div>

            <h1>Búsqueda de puestos</h1>

            <h3>Filtros</h3>

            {
                busquedaPuestosState
                    .caracteristicasRaiz
                    .map(raiz => (

                        <CaracteristicaNodo
                            key={raiz.id}
                            nodo={raiz}
                            seleccionadas={
                                busquedaPuestosState
                                    .caracteristicasSeleccionadas
                            }
                            handleCheckbox={handleCheckbox}
                        />

                    ))
            }

            <button onClick={handleFiltrar}>Filtrar</button>

            <h3>Resultados</h3>

            {
                busquedaPuestosState.puestos.map(puesto => (

                    <div key={puesto.id}>

                        <p><strong>Empresa:</strong>{puesto.empresa.nombre}</p>

                        <p><strong>Descripción:</strong>{puesto.descripcion}</p>

                        <p><strong>Salario:</strong>₡ {puesto.salario}</p>

                    </div>

                ))
            }

        </div>
    );
}

function CaracteristicaNodo({nodo, seleccionadas, handleCheckbox}) {
    return (
        <div>
            <details>
                <summary>
                    <input type="checkbox" checked={seleccionadas.includes(nodo.id)} onChange={(e) => handleCheckbox(nodo.id, e.target.checked)}/>
                    {nodo.nombre}
                </summary>

                {
                    nodo.caracteristicas &&
                    nodo.caracteristicas.map(hijo => (
                        <CaracteristicaNodo
                            key={hijo.id}
                            nodo={hijo}
                            seleccionadas={seleccionadas}
                            handleCheckbox={handleCheckbox}
                        />

                    ))
                }

            </details>

        </div>
    );
}

export default BuscarPuestos;