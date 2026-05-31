import { useNavigate } from 'react-router-dom';
import s from './DetalleCandidato.module.css';

const oferenteEjemplo = {
    id: 1,
    nombre: 'Juan',
    primerApellido: 'Pérez',
    correoElectronico: 'juan.perez@email.com',
    telefono: '8888-1234',
    lugarResidencia: 'San José',
    oferentecaracteristicas: [
        { caracteristica: { id: 1, nombre: 'Java' }, nivel: 4 },
        { caracteristica: { id: 2, nombre: 'SQL' }, nivel: 3 },
        { caracteristica: { id: 3, nombre: 'Spring Boot' }, nivel: 5 },
    ]
};

function DetalleCandidato() {
    const navigate = useNavigate();

    return (
        <div className={s['candidato-detalle']}>
            <h1 className={s['candidato-detalle__title']}>Detalle del oferente</h1>

            <div className={s['candidato-detalle__cv']}>
                <button
                    className={s['candidato-detalle__cv-btn']}
                    type="button"
                    onClick={() => console.log('Ver CV')}
                >
                    Ver CV
                </button>
            </div>

            <section className={s['candidato-detalle__info']}>
                <h2 className={s['candidato-detalle__info-title']}>Detalle de oferente</h2>
                <h3 className={s['candidato-detalle__name']}>
                    {oferenteEjemplo.nombre} {oferenteEjemplo.primerApellido}
                </h3>
                <ul className={s['candidato-detalle__list']}>
                    <li className={s['candidato-detalle__list-item']}>
                        Identificación: <span>{oferenteEjemplo.id}</span>
                    </li>
                    <li className={s['candidato-detalle__list-item']}>
                        Email: <span>{oferenteEjemplo.correoElectronico}</span>
                    </li>
                    <li className={s['candidato-detalle__list-item']}>
                        Teléfono: <span>{oferenteEjemplo.telefono}</span>
                    </li>
                    <li className={s['candidato-detalle__list-item']}>
                        Residencia: <span>{oferenteEjemplo.lugarResidencia}</span>
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
                        {oferenteEjemplo.oferentecaracteristicas.map(oc => (
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

            <div className={s['candidato-detalle__volver']}>
                <button
                    className={s['candidato-detalle__volver-btn']}
                    type="button"
                    onClick={() => navigate(-1)}
                >
                    Volver
                </button>
            </div>
        </div>
    );
}

export default DetalleCandidato;
