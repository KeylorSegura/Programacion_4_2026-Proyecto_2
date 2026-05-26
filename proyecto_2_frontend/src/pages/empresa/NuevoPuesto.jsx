import { useState } from 'react';
import s from './NuevoPuesto.module.css';
import CaracteristicaTree from '@/components/CaracteristicaTree.jsx';

const caracteristicasEjemplo = [
    {
        id: 1,
        nombre: 'Programación',
        caracteristicas: [
            { id: 2, nombre: 'Java', caracteristicas: [] },
            { id: 3, nombre: 'Python', caracteristicas: [] },
        ]
    },
    {
        id: 4,
        nombre: 'Bases de datos',
        caracteristicas: [
            { id: 5, nombre: 'SQL', caracteristicas: [] },
            { id: 6, nombre: 'NoSQL', caracteristicas: [] },
        ]
    },
];

function NuevoPuesto() {
    const [descripcion, setDescripcion] = useState('');
    const [salario, setSalario] = useState('');
    const [tipoPublicacion, setTipoPublicacion] = useState('Publica');

    function handleSubmit(e) {
        e.preventDefault();
        console.log({ descripcion, salario, tipoPublicacion });
    }

    return (
        <div className={s['puesto-form']}>
            <h1 className={s['puesto-form__title']}>Crear Puesto</h1>

            <form className={s['puesto-form__form']} onSubmit={handleSubmit}>
                <div className={s['puesto-form__field']}>
                    <label className={s['puesto-form__label']}>Descripción</label>
                    <input
                        className={s['puesto-form__input']}
                        type="text"
                        value={descripcion}
                        onChange={e => setDescripcion(e.target.value)}
                    />
                </div>

                <div className={s['puesto-form__field']}>
                    <label className={s['puesto-form__label']}>Salario</label>
                    <input
                        className={s['puesto-form__input']}
                        type="text"
                        value={salario}
                        onChange={e => setSalario(e.target.value)}
                    />
                </div>

                <div className={s['puesto-form__field']}>
                    <label className={s['puesto-form__label']}>Tipo de Publicación</label>
                    <select
                        className={s['puesto-form__select']}
                        value={tipoPublicacion}
                        onChange={e => setTipoPublicacion(e.target.value)}
                    >
                        <option value="Publica">Publica</option>
                        <option value="Privada">Privada</option>
                    </select>
                </div>

                <div className={s['puesto-form__caracteristicas']}>
                    <h3 className={s['puesto-form__caracteristicas-title']}>
                        Características requeridas
                    </h3>
                    {caracteristicasEjemplo.map(raiz => (
                        <CaracteristicaTree key={raiz.id} nodo={raiz} />
                    ))}
                </div>

                <button className={s['puesto-form__submit']} type="submit">
                    Guardar Puesto
                </button>
            </form>
        </div>
    );
}

export default NuevoPuesto;
