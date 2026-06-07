import { useEffect, useState } from "react";
import Modal from "react-modal";
import s from './Principal.module.css';
import AlertModal from '../../components/Modal/AlertModal';
import { httpErrorMessage } from '@/utils/httpErrors';

Modal.setAppElement('#root'); // Esto es para accesibilidad

function Principal() {
    const [puestos, setPuestos] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [puestoSeleccionado, setPuestoSeleccionado] = useState(null);
    const [modal, setModal] = useState({ open: false, type: 'error', message: '' });

    const backend = "http://localhost:8080/api/publico";

    useEffect(() => {
        const fetchPuestos = async () => {
            try {
                const response = await fetch(`${backend}/principal`);
                if (!response.ok) { setModal({ open: true, type: 'error', message: httpErrorMessage(response.status) }); return; }
                const data = await response.json();
                setPuestos(data);
            } catch (error) {
                console.error(error);
                setModal({ open: true, type: 'error', message: 'Error al conectarse con el servidor' });
            }
        };

        fetchPuestos();
    }, []);


    // function handleList(){
    //     const request = new Request(backend+'/publico/principal', {method: 'GET', headers: { }});
    //     (async ()=>{
    //         const response = await fetch(request);
    //         if (!response.ok) {alert("Error: "+response.status);return;}
    //         const puestos = await response.json();
    //         setPuestos(puestos);
    //     })();
    // }

    const abrirDetalle = (puesto) => {
        setPuestoSeleccionado(puesto);
        setModalOpen(true);
    }

    const cerrarDetalle = () => {
        setPuestoSeleccionado(null);
        setModalOpen(false);
    }

    return (
        <div className={s.page__main}>
            <div className={s.page__container}>
                <h1 className={s.page__title}>Bolsa de Empleo</h1>
                <p className={s.page__subtitle}>Últimos 5 puestos públicos</p>

                {puestos.length === 0 ? (
                    <p className={s.page__empty}>No hay puestos disponibles.</p>
                ) : (
                    <div className={s.jobs}>
                        {puestos.map(p => (
                            <div className={s.card} key={p.id}>
                                <h3 className={s.card__title}>{p.empresa.nombre}</h3>
                                <p className={s.card__description}>{p.descripcion}</p>
                                <p className={s.card__salary}>₡ {p.salario.toFixed(2)}</p>

                                <button className={s.card__button} onClick={() => abrirDetalle(p)}>Ver detalle</button>
                            </div>
                        ))}
                    </div>
                )}

                {puestoSeleccionado && (
                    <Modal
                        isOpen={modalOpen}
                        onRequestClose={cerrarDetalle}
                        contentLabel="Detalle del Puesto"
                        className={s.modal}
                        overlayClassName={s.overlay}
                    >
                        <h3 className={s.card__title}>{puestoSeleccionado.empresa.nombre}</h3>

                        <h2 className={s.card__description}>{puestoSeleccionado.descripcion}</h2>

                        <p className={s.card__salary}>₡ {puestoSeleccionado.salario.toFixed(2)}</p>

                        <ul className={s.card__list}>
                            {puestoSeleccionado.puestocaracteristicas.map(pc => (
                                <li key={pc.caracteristica.id}>
                                    <span>{pc.caracteristica.rutaCompleta}</span> -
                                    Nivel: <span>{pc.nivel}</span>
                                </li>
                            ))}
                        </ul>

                        <button  onClick={cerrarDetalle}>Cerrar</button>
                    </Modal>
                )}

                <AlertModal
                    type={modal.type}
                    message={modal.message}
                    open={modal.open}
                    onClose={() => setModal({ ...modal, open: false })}
                />
            </div>
        </div>
    );
}

export default Principal;