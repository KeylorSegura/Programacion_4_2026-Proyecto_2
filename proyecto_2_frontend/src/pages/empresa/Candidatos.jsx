import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import s from './Candidatos.module.css';
import BotonRegresar from '@/components/BotonRegresar.jsx';

function Candidatos() {
    const [searchParams] = useSearchParams();
    const puestoId = searchParams.get('id');

    const [puesto, setPuesto] = useState(null);
    const [candidatos, setCandidatos] = useState([]);

    const backend = "http://localhost:8080/api";

    function handleCandidatos() {
        const token = localStorage.getItem('token');

        const request = new Request(
            backend + "/empresa/puestos/" + puestoId + "/candidatos",
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

            setPuesto(data.puesto);
            setCandidatos(data.candidatos);
        })();
    }

    useEffect(() => {
        handleCandidatos();
    }, []);

    return (
        <div className={s['candidatos']}>
            <h1 className={s['candidatos__title']}>Candidatos para el puesto</h1>
            <h2 className={s['candidatos__puesto']}>
                Puesto: <span className={s['candidatos__puesto-nombre']}>{puesto?.descripcion}</span>
            </h2>

            <table className={s['candidatos__table']}>
                <thead>
                    <tr>
                        <th className={s['candidatos__cell--header']}>Oferente</th>
                        <th className={s['candidatos__cell--header']}>Requisitos cumplidos</th>
                        <th className={s['candidatos__cell--header']}>% Coincidencia</th>
                        <th className={s['candidatos__cell--header']}>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {candidatos.map(candidato => (
                        <tr className={s['candidatos__row']} key={candidato.id}>
                            <td className={s['candidatos__cell']}>
                                {candidato.nombre} {candidato.primerApellido}
                            </td>
                            <td className={s['candidatos__cell']}>
                                {candidato.requisitosCumplidos}/{candidato.totalRequisitos}
                            </td>
                            <td className={`${s['candidatos__cell']} ${s['candidatos__cell--porcentaje']}`}>
                                {candidato.porcentajeCoincidencia}%
                            </td>
                            <td className={`${s['candidatos__cell']} ${s['candidatos__cell--accion']}`}>
                                <Link
                                    className={s['candidatos__btn']}
                                    to={`/empresa/candidatos/detalle?id=${candidato.id}`}
                                >
                                    Ver detalles
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <BotonRegresar />
        </div>
    );
}

export default Candidatos;
