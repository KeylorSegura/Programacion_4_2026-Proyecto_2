import { useContext, useEffect } from "react";
import { AppContext } from "@/AppProvider";
import s from './BuscarPuestos.module.css';

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
        <div className={s.main__container}>

            <h1 className={s.page__title}>Búsqueda de puestos</h1>

            <div className={s.habilidades__grid}>

                <div className={s.container__left}>


                    <h3 className={s.page__subtitle}>Filtros</h3>

                    <div className={s.filtrador}>
                        <button className={`${s.filtrador__button} ${s['filtrador__button--filtrar']}`} onClick={handleFiltrar}>Filtrar</button>

                        {busquedaPuestosState
                                .caracteristicasRaiz
                                .map(raiz => (
                                    <CaracteristicaNodo key={raiz.id} nodo={raiz} seleccionadas={busquedaPuestosState.caracteristicasSeleccionadas} handleCheckbox={handleCheckbox}/>
                                ))}

                    </div>

                </div>

                <div className={s.container__right}>

                    <h3 className={s.page__subtitle} >Resultados</h3>

                    <div className={s.resultados}>
                        {busquedaPuestosState.puestos.length === 0 ? (
                            <div className={s.resultados__empty}>
                                <p>No hay resultados</p>
                            </div>
                        ) : (
                            <div className={s.resultados__list}>
                                {busquedaPuestosState.puestos.map(puesto => (
                                    <div key={puesto.id} className={s.puesto}>
                                        <p className={s.puesto__empresa}><strong>Empresa:</strong>{" "}{puesto.empresa.nombre}</p>

                                        <p className={s.puesto__descripcion}><strong>Descripción:</strong>{" "}{puesto.descripcion}</p>

                                        <p className={s.puesto__salario}><strong>Salario:</strong> ₡ {puesto.salario}</p>
                                    </div>

                                ))}

                            </div>

                        )}

                    </div>


                </div>

            </div>

        </div>
    );
}

function CaracteristicaNodo({nodo, seleccionadas, handleCheckbox}) {
    return (
        <div className={s['caracteristica-nodo']}>
            <details className={s['caracteristica-nodo__detalle']}>
                <summary className={s['caracteristica-nodo__resumen']}>
                    <input className={s['caracteristica-nodo__checkbox']} type="checkbox" checked={seleccionadas.includes(nodo.id)} onChange={(e) => handleCheckbox(nodo.id, e.target.checked)}/>
                    {nodo.nombre}
                </summary>

                {nodo.caracteristicas?.length > 0 && (
                    <div className={s['caracteristica-nodo__hijos']}>

                {nodo.caracteristicas && nodo.caracteristicas.map(hijo => (<CaracteristicaNodo key={hijo.id} nodo={hijo} seleccionadas={seleccionadas} handleCheckbox={handleCheckbox}/>))
                }
                    </div>
                )}

            </details>

        </div>
    );
}

export default BuscarPuestos;