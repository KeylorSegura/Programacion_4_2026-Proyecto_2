import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import s from './DetalleCandidato.module.css';
import BotonRegresar from '@/components/BotonRegresar.jsx';

function DetalleCandidato() {
    const [searchParams] = useSearchParams();
    const oferenteId = searchParams.get('id');

    const [oferente, setOferente] = useState(null);

    const backend = "http://localhost:8080/api";

    function handleOferente() {
        const token = localStorage.getItem('token');

        const request = new Request(
            backend + "/empresa/candidatos/oferente?id=" + oferenteId,
            {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        (async () => {
            const response = await fetch(request);

            if (!response.ok) {
                alert("Error: " + response.status);
                return;
            }

            const data = await response.json();

            setOferente(data);
        })();
    }

    useEffect(() => {
        handleOferente();
    }, []);

    function handleVerCV() {
        const token = localStorage.getItem('token');

        const request = new Request(
            backend + "/empresa/candidatos/oferente/verCV?id=" + oferenteId,
            {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        (async () => {
            const response = await fetch(request);

            if (!response.ok) {
                alert("Error: " + response.status);
                return;
            }

            const blob = await response.blob();

            window.open(URL.createObjectURL(blob), "_blank");
        })();
    }

    return (
        <div className={s['candidato-detalle']}>
            <h1 className={s['candidato-detalle__title']}>Detalle del oferente</h1>

            <div className={s['candidato-detalle__cv']}>
                <button
                    className={s['candidato-detalle__cv-btn']}
                    type="button"
                    onClick={handleVerCV}
                >
                    Ver CV
                </button>
            </div>

            <section className={s['candidato-detalle__info']}>
                <h2 className={s['candidato-detalle__info-title']}>Detalle de oferente</h2>
                <h3 className={s['candidato-detalle__name']}>
                    {oferente?.nombre} {oferente?.primerApellido}
                </h3>
                <ul className={s['candidato-detalle__list']}>
                    <li className={s['candidato-detalle__list-item']}>
                        Identificación: <span>{oferente?.id}</span>
                    </li>
                    <li className={s['candidato-detalle__list-item']}>
                        Email: <span>{oferente?.correoElectronico}</span>
                    </li>
                    <li className={s['candidato-detalle__list-item']}>
                        Teléfono: <span>{oferente?.telefono}</span>
                    </li>
                    <li className={s['candidato-detalle__list-item']}>
                        Residencia: <span>{oferente?.lugarResidencia}</span>
                    </li>
                </ul>
            </section>

            <section className={s['candidato-detalle__habilidades']}>
                <h3 className={s['candidato-detalle__habilidades-title']}>Habilidades</h3>
                <table className={s['candidato-detalle__table']}>
                    <thead className={s['candidato-detalle__table-head']}>
                        <tr className={s['candidato-detalle__row']}>
                            <th className={`${s['candidato-detalle__cell']} ${s['candidato-detalle__cell--header']}`}>
                                Característica
                            </th>
                            <th className={`${s['candidato-detalle__cell']} ${s['candidato-detalle__cell--header']}`}>
                                Nivel
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(oferente?.oferentecaracteristicas ?? []).map(oc => (
                            <tr className={s['candidato-detalle__row']} key={oc.caracteristica.id}>
                                <td className={s['candidato-detalle__cell']}>
                                    {oc.caracteristica.nombre}
                                </td>
                                <td className={`${s['candidato-detalle__cell']} ${s['candidato-detalle__cell--nivel']}`}>
                                    {oc.nivel}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <BotonRegresar />
        </div>
    );
}

export default DetalleCandidato;