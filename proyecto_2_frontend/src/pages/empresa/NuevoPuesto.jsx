import { useState, useEffect } from 'react';
import s from './NuevoPuesto.module.css';
import CaracteristicaTree from '@/components/CaracteristicaTree.jsx';
import BotonRegresar from '@/components/BotonRegresar.jsx';

function NuevoPuesto() {
    const [descripcion, setDescripcion] = useState('');
    const [salario, setSalario] = useState('');
    const [tipoPublicacion, setTipoPublicacion] = useState('Publica');
    const [caracteristicas, setCaracteristicas] = useState([]);

    const backend = "http://localhost:8080/api";

    function handleCaracteristicas() {
        const token = localStorage.getItem('token');

        const request = new Request(
            backend + "/empresa/caracteristicas-raiz",
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

            setCaracteristicas(data);
        })();
    }

    useEffect(() => {
        handleCaracteristicas();
    }, []);

    function handleCrearPuesto(caracteristicasSeleccionadas) {
        const token = localStorage.getItem('token');

        const body = {
            descripcion: descripcion,
            salario: salario === '' ? null : Number(salario),
            tipoPublicacion: tipoPublicacion,
            caracteristicas: caracteristicasSeleccionadas
        };

        const request = new Request(
            backend + "/empresa/crear/puesto",
            {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }
        );

        (async () => {
            const response = await fetch(request);

            if (!response.ok) {
                alert("Error: " + response.status);
                return;
            }

            alert("Puesto creado correctamente");

            setDescripcion('');
            setSalario('');
            setTipoPublicacion('Publica');
        })();
    }

    function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;

        const caracteristicasSeleccionadas = Array
            .from(form.querySelectorAll('input[name="caracteristicaIds"]:checked'))
            .map(checkbox => {
                const id = Number(checkbox.value);
                const nivelInput = form.querySelector(`input[name="nivel_${id}"]`);

                return {
                    caracteristicaId: id,
                    nivel: Number(nivelInput.value)
                };
            });

        handleCrearPuesto(caracteristicasSeleccionadas);
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
                    {caracteristicas.map(raiz => (
                        <CaracteristicaTree key={raiz.id} nodo={raiz} />
                    ))}
                </div>

                <button className={s['puesto-form__submit']} type="submit">
                    Guardar Puesto
                </button>
            </form>

            <BotonRegresar />
        </div>
    );
}

export default NuevoPuesto;
