import { useEffect, useState } from 'react';
import './Aprobaciones.css';
import AlertModal from '../../components/Modal/AlertModal';
import { httpErrorMessage } from '@/utils/httpErrors';

function OferentesPendientes() {

    const [oferentes, setOferentes] = useState([]);
    const [modal, setModal] = useState({ open: false, type: 'error', message: '' });

    const backend = "http://localhost:8080/api/admin";



    function handleList() {
        const token = localStorage.getItem('token');

        const request = new Request(
            backend + '/oferentes-pendientes',
            { method: 'GET', headers: {'Authorization': `Bearer ${token}`} }
        );

        (async () => {

            const response = await fetch(request);

            if (!response.ok) {
                setModal({ open: true, type: 'error', message: httpErrorMessage(response.status) });
                return;
            }

            const oferentes = await response.json();

            setOferentes(oferentes);

        })();
    }

    useEffect(() => {
        handleList();
    }, []);

    function handleAutorizar(id) {
        const token = localStorage.getItem('token');

        const request = new Request(
            backend + '/autorizarOferente/' + id,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        (async () => {

            const response = await fetch(request);

            if (!response.ok) {
                setModal({ open: true, type: 'error', message: httpErrorMessage(response.status) });
                return;
            }

            handleList();

        })();
    }

    return (
        <main className="aprobaciones">
            <div className="aprobaciones__container">

                <h2 className="aprobaciones__title">
                    Oferentes pendientes
                </h2>

                <div className="aprobaciones__card">

                    <List
                        list={oferentes}
                        handleAutorizar={handleAutorizar}
                    />

                </div>

            </div>

            <AlertModal
                type={modal.type}
                message={modal.message}
                open={modal.open}
                onClose={() => setModal({ ...modal, open: false })}
            />
        </main>
    );
}

function List({ list, handleAutorizar }) {

    return (
        <table className="aprobaciones__table">

            <thead className="aprobaciones__head">
            <tr className="aprobaciones__row">
                <th className="aprobaciones__cell">
                    Usuario
                </th>

                <th className="aprobaciones__cell aprobaciones__cell--action">
                    Acción
                </th>
            </tr>
            </thead>

            <tbody>

            {list.map(o => (

                <Item
                    key={o.id}
                    oferente={o}
                    handleAutorizar={handleAutorizar}
                />

            ))}

            </tbody>

        </table>
    );
}

function Item({ oferente, handleAutorizar }) {

    return (
        <tr className="aprobaciones__row">

            <td className="aprobaciones__cell">
                {oferente.nombre}
            </td>

            <td className="aprobaciones__cell aprobaciones__cell--action">

                <button
                    className="aprobaciones__button"
                    onClick={() => handleAutorizar(oferente.id)}
                >
                    Aprobar y generar clave
                </button>

            </td>

        </tr>
    );
}

export default OferentesPendientes;