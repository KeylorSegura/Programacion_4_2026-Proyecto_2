import { useContext, useEffect } from "react";
import { AppContext } from "../../AppProvider";
import s from "./MisHabilidades.module.css";

function MisHabilidades() {

    const {
        habilidadesState,
        setHabilidadesState
    } = useContext(AppContext);

    const backend = "http://localhost:8080/api";


    useEffect(() => {

        if (habilidadesState.habilidades.length === 0) {
            handleLoadInicial();
        }

    }, []);

    function handleLoadInicial() {

        const request = new Request(
            backend + "/oferente/habilidades/" + JSON.parse(atob(localStorage.getItem("token").split('.')[1])).id, {method: "GET", headers: {'Authorization': 'Bearer '+localStorage.getItem('token') }}
        );

        (async () => {
            const response = await fetch(request);
            if (!response.ok) {
                console.log(await response.text());
                alert("Error: " + response.status);
                return;
            }
            const habilidades = await response.json();
            const requestRaices = new Request(backend + "/oferente/habilidades/ruta/0", {method: "GET", headers: {'Authorization': 'Bearer '+localStorage.getItem('token')}});
            const responseRaices = await fetch(requestRaices);

            if (!responseRaices.ok) {
                alert("Error: " + responseRaices.status);
                return;
            }

            const raices = await responseRaices.json();

            setHabilidadesState({
                ...habilidadesState,
                habilidades: habilidades,
                caracteristicasActuales: raices,
                ruta: []
            });

        })();
    }

    function handleEntrar(caracteristica) {

        const request = new Request(backend + "/oferente/habilidades/subcategorias/" + caracteristica.id, {method: "GET", headers: {'Authorization': 'Bearer '+localStorage.getItem('token')}});

        (async () => {
            const response = await fetch(request);
            if (!response.ok) {
                alert("Error: " + response.status);
                return;
            }
            const data = await response.json();
            let rutaNueva = [...habilidadesState.ruta];
            rutaNueva.push(caracteristica);
            setHabilidadesState({
                ...habilidadesState,
                caracteristicasActuales: data,
                ruta: rutaNueva,
                habilidad: {
                    ...habilidadesState.habilidad,
                    caracteristicaId: caracteristica.id
                }
            });

        })();
    }

    function handleVolver(index) {
        let padreId = 0;
        if (index > 0) {
            padreId = habilidadesState.ruta[index - 1].id;
        }
        const request = new Request(
            backend + "/oferente/habilidades/ruta/" + padreId,
            {
                method: "GET",
                headers: {'Authorization': 'Bearer '+localStorage.getItem('token')}
            }
        );

        (async () => {
            const response = await fetch(request);
            if (!response.ok) {
                alert("Error: " + response.status);
                return;
            }
            const data = await response.json();
            let nuevaRuta =
                habilidadesState.ruta.slice(0, index);

            setHabilidadesState({
                ...habilidadesState,
                caracteristicasActuales: data,
                ruta: nuevaRuta
            });

        })();
    }

    function handleFieldChange(event) {

        const field = event.target;

        const value = field.value;

        const name = field.name;

        let habilidadChanged = {
            ...habilidadesState.habilidad
        };

        habilidadChanged[name] = value;

        setHabilidadesState({
            ...habilidadesState,
            habilidad: habilidadChanged
        });
    }

    function handleAgregar(event) {

        event.preventDefault();

        const request = new Request(
            backend + "/oferente/habilidades/agregar/" + JSON.parse(atob(localStorage.getItem("token").split('.')[1])).id,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify(
                    habilidadesState.habilidad
                )
            }
        );

        (async () => {

            const response = await fetch(request);

            if (!response.ok) {
                alert("Error: " + response.status);
                return;
            }

            handleLoadInicial();

            setHabilidadesState({
                ...habilidadesState,
                habilidad: {
                    ...habilidadesState.habilidad,
                    nivel: ""
                }
            });

        })();
    }

    return (
        <>

            <div className={s["main__container"]}>
                <ListaHabilidades
                    list={habilidadesState.habilidades}
                />

                <hr />

                <MapaHabilidades
                    ruta={habilidadesState.ruta}
                    caracteristicasActuales={habilidadesState.caracteristicasActuales}
                    handleEntrar={handleEntrar}
                    handleVolver={handleVolver}
                />

                <hr />

                <AgregarHabilidad
                    habilidad={habilidadesState.habilidad}
                    caracteristicasActuales={habilidadesState.caracteristicasActuales}
                    handleFieldChange={handleFieldChange}
                    handleAgregar={handleAgregar}
                />
            </div>
        </>
    );
}

function ListaHabilidades({ list }) {

    return (
        <div className={s.habilidades__panel + " " + s["habilidades__panel--lista"]}>

            <h1 className={s.page__title}>Mis Habilidades</h1>
            <table className={s.habilidades__table}>
                <thead className={s.habilidades__thead}>
                <tr className={s.habilidades__row}>
                    <th className={s.habilidades__header}>Característica</th>
                    <th className={s.habilidades__header}>Nivel</th>
                </tr>
                </thead>

                <tbody className={s.habilidades__tbody}>

                {
                    list.map((habilidad, index) =>

                        <tr className={s.habilidades__row} key={index}>
                            <td className={s.habilidades__cell}>{habilidad.ruta}</td>
                            <td className={s.habilidades__cell}>{habilidad.nivel}</td>
                        </tr>
                    )
                }

                </tbody>
            </table>
        </div>
    );
}

function MapaHabilidades({ruta, caracteristicasActuales, handleEntrar, handleVolver}) {
    return (
        <div className={s.habilidades__panel + " " + s["habilidades__panel--ruta"]}>
            <h2 className={s.habilidades__subtitle}>Ruta</h2>
            <div className={s.habilidades__breadcrumb}>
                <span className={s.habilidades__link} onClick={() => handleVolver(0)}>Raíces</span>
                {
                    ruta.map((caracteristica, index) => (
                        <span className={s.habilidades__separator} key={caracteristica.id}>{" / "}<span className={s.habilidades__link} onClick={() => handleVolver(index + 1)}>{caracteristica.nombre}</span></span>
                    ))
                }
            </div>
            <br />
            <h3 className={s.habilidades__subtitle}>Subcategorías</h3>
            <table className={s.habilidades__table}>
                <tbody className={s.habilidades__tbody}>
                {
                    caracteristicasActuales.map(caracteristica =>
                        <tr className={`${s.habilidades__row} ${caracteristica.tieneHijos ? s.activa : s.deshabilitada}`} key={caracteristica.id} onClick={ caracteristica.tieneHijos ? () => handleEntrar(caracteristica) : undefined} >
                            <td className={s.habilidades__cell}>{caracteristica.nombre}</td>
                            <td className={s.habilidades__cell}>
                                <button className={s["habilidades-form__button"]} onClick={() => handleEntrar(caracteristica)} disabled={!caracteristica.tieneHijos}>Entrar</button>
                            </td>
                        </tr>
                    )
                }
                </tbody>
            </table>
        </div>
    );
}

function AgregarHabilidad({habilidad, caracteristicasActuales, handleFieldChange, handleAgregar}) {
    return (
        <div className={s.habilidades__panel + " " + s["habilidades__panel--agregar"]}>
            <h1 className={s.page__title}>Agregar Habilidad</h1>
            <form className={s["habilidades-form"]} onSubmit={handleAgregar}>
                <table>
                    <tbody>
                    <tr>
                        <td>
                            <label className={s["habilidades-form__label"]}>Característica</label>
                        </td>

                        <td>
                            <select className={s["habilidades-form__select"]} name="caracteristicaId" value={habilidad.caracteristicaId} onChange={handleFieldChange} required>
                                <option className={s["habilidades-form__option"]} value="">Seleccione</option>

                                {
                                    caracteristicasActuales.map(c =>
                                        <option className={s["habilidades-form__option"]} value={c.id} key={c.id}>{c.nombre}</option>
                                    )
                                }

                            </select>

                        </td>

                    </tr>

                    <tr>
                        <td>
                            <label className={s["habilidades-form__label"]}>Nivel</label>
                        </td>

                        <td>
                            <input className={s["habilidades-form__input"]} type="number" name="nivel" min="1" max="5" value={habilidad.nivel} onChange={handleFieldChange} required/>
                        </td>
                    </tr>

                    <tr>
                        <td colSpan="2" className={s["habilidades-form__actions"]}>
                            <input className={s["habilidades-form__button"]} type="submit" value="Agregar" disabled={caracteristicasActuales.length === 0}/>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}
export default MisHabilidades;