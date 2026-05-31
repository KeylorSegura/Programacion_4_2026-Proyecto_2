import { useState } from 'react';
import { Link } from 'react-router-dom';
import s from './MisPuestos.module.css';

const datosPuestos = [
    { id: 1, descripcion: 'Desarrollador Java Senior', salario: 1500000, activo: 1 },
    { id: 2, descripcion: 'Analista de datos', salario: 900000, activo: 1 },
    { id: 3, descripcion: 'Diseñador UX/UI', salario: 800000, activo: 0 },
];

function MisPuestos() {
    const [puestos, setPuestos] = useState(datosPuestos);

    function handleToggle(id) {
        setPuestos(puestos.map(p =>
            p.id === id ? { ...p, activo: p.activo === 1 ? 0 : 1 } : p
        ));
    }

    return (
        <div className={s['mis-puestos']}>
            <div className={s['mis-puestos__header']}>
                <h1 className={s['mis-puestos__title']}>Mis Puestos</h1>
                <Link className={s['mis-puestos__new-link']} to="/empresa/puestos/nuevo">
                    <button className={s['mis-puestos__new-btn']} type="button">
                        Publicar puesto
                    </button>
                </Link>
            </div>

            <table className={s['mis-puestos__table']}>
                <thead>
                    <tr>
                        <th className={s['mis-puestos__cell--header']}>ID</th>
                        <th className={s['mis-puestos__cell--header']}>Descripción</th>
                        <th className={s['mis-puestos__cell--header']}>Salario</th>
                        <th className={s['mis-puestos__cell--header']}>Estado</th>
                        <th className={s['mis-puestos__cell--header']}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {puestos.map(puesto => (
                        <tr className={s['mis-puestos__row']} key={puesto.id}>
                            <td className={s['mis-puestos__cell']}>{puesto.id}</td>
                            <td className={s['mis-puestos__cell']}>{puesto.descripcion}</td>
                            <td className={s['mis-puestos__cell']}>{puesto.salario}</td>
                            <td className={`${s['mis-puestos__cell']} ${s['mis-puestos__cell--estado']}`}>
                                {puesto.activo === 1 ? 'Activo' : 'Inactivo'}
                            </td>
                            <td className={`${s['mis-puestos__cell']} ${s['mis-puestos__cell--acciones']}`}>
                                <button
                                    className={`${s['mis-puestos__btn']} ${s['mis-puestos__btn--toggle']}`}
                                    type="button"
                                    onClick={() => handleToggle(puesto.id)}
                                >
                                    {puesto.activo === 1 ? 'Desactivar' : 'Activar'}
                                </button>
                                <Link
                                    className={`${s['mis-puestos__btn']} ${s['mis-puestos__btn--candidatos']}`}
                                    to={`/empresa/candidatos?id=${puesto.id}`}
                                >
                                    Mostrar Candidatos
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MisPuestos;
