import { Link } from 'react-router-dom';
import './DashboardOferente.css';

function DashboardOferente() {
    return (
        <main className="main_oferente">
            <div className="main__container">
                <h1 className="page__title">Dashboard</h1>

                <h3 className="page__subtitle">Administra tus habilidades y tu CV</h3>

                <div className="dashboard__buttons">
                    <Link className="dashboard__link" to="/oferente/habilidades">
                        <button className="dashboard__button" type="button">Mis Habilidades</button>
                    </Link>

                    <Link className="dashboard__link" to="/oferente/cv">
                        <button className="dashboard__button" type="button">Ver CV</button>
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default DashboardOferente;