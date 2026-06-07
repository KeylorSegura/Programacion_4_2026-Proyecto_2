import { useEffect, useState } from 'react';
import './Aprobaciones.css';
import AlertModal from '../../components/Modal/AlertModal';
import { httpErrorMessage } from '@/utils/httpErrors';

function EmpresasPendientes() {

    const [empresas, setEmpresas] = useState([]);
    const [modal, setModal] = useState({ open: false, type: 'error', message: '' });

    const backend = "http://localhost:8080/api/admin";

    function handleList() {
        const token = localStorage.getItem('token');

        const request = new Request(
            backend + '/empresas-pendientes',
            { method: 'GET', headers: {'Authorization': `Bearer ${token}`} }
        );

        (async () => {

            const response = await fetch(request);

            if (!response.ok) {
                setModal({ open: true, type: 'error', message: httpErrorMessage(response.status) });
                return;
            }

            const empresas = await response.json();

            setEmpresas(empresas);

        })();
    }

    useEffect(() => {
        handleList();
    }, []);



    function handleAutorizar(id) {
        const token = localStorage.getItem('token');

        const request = new Request(
            backend + '/autorizarEmpresa/' + id,
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
                    Empresas pendientes
                </h2>

                <div className="aprobaciones__card">

                    <List
                        list={empresas}
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

            {list.map(e => (

                <Item
                    key={e.id}
                    empresa={e}
                    handleAutorizar={handleAutorizar}
                />

            ))}

            </tbody>

        </table>
    );
}

function Item({ empresa, handleAutorizar }) {

    return (
        <tr className="aprobaciones__row">

            <td className="aprobaciones__cell">
                {empresa.nombre}
            </td>

            <td className="aprobaciones__cell aprobaciones__cell--action">

                <button
                    className="aprobaciones__button"
                    onClick={() => handleAutorizar(empresa.id)}
                >
                    Aprobar y generar clave
                </button>

            </td>

        </tr>
    );
}

export default EmpresasPendientes;