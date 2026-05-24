import { Link } from 'react-router-dom';
import './DashboardAdmin.css';

function DashboardAdmin() {

    return (
        <main className="admin-dashboard">
            <div className="admin-dashboard__container">

                <h1 className="admin-dashboard__title">
                    Administrador
                </h1>

                <p className="admin-dashboard__subtitle">
                    Aprobaciones, catálogo de características y reportes.
                </p>

                <div className="admin-dashboard__actions">

                    <Link
                        className="admin-dashboard__link"
                        to="/admin/empresas-pendientes"
                    >
                        <button
                            className="admin-dashboard__button"
                            type="button"
                        >
                            Empresas pendientes
                        </button>
                    </Link>

                    <Link
                        className="admin-dashboard__link"
                        to="/admin/oferentes-pendientes"
                    >
                        <button
                            className="admin-dashboard__button"
                            type="button"
                        >
                            Oferentes pendientes
                        </button>
                    </Link>

                    <Link
                        className="admin-dashboard__link"
                        to="/admin/caracteristicas"
                    >
                        <button
                            className="admin-dashboard__button"
                            type="button"
                        >
                            Características
                        </button>
                    </Link>

                    <Link
                        className="admin-dashboard__link"
                        to="/admin/reportes"
                    >
                        <button
                            className="admin-dashboard__button"
                            type="button"
                        >
                            Reportes
                        </button>
                    </Link>

                </div>

            </div>
        </main>
    );
}

export default DashboardAdmin;