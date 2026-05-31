import { Link } from 'react-router-dom';
import s from './Candidatos.module.css';

const datosCandidatos = [
    { id: 1, nombre: 'Juan', primerApellido: 'Pérez', requisitosCumplidos: 4, totalRequisitos: 5, porcentajeCoincidencia: 80 },
    { id: 2, nombre: 'María', primerApellido: 'González', requisitosCumplidos: 3, totalRequisitos: 5, porcentajeCoincidencia: 60 },
    { id: 3, nombre: 'Carlos', primerApellido: 'Ramírez', requisitosCumplidos: 5, totalRequisitos: 5, porcentajeCoincidencia: 100 },
];

function Candidatos() {
    return (
        <div className={s['candidatos']}>
            <h1 className={s['candidatos__title']}>Candidatos para el puesto</h1>
            <h2 className={s['candidatos__puesto']}>
                Puesto: <span className={s['candidatos__puesto-nombre']}>Desarrollador Java Senior</span>
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
                    {datosCandidatos.map(candidato => (
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
        </div>
    );
}

export default Candidatos;
