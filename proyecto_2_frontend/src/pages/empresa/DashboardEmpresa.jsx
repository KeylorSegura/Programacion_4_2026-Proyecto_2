import { Link } from 'react-router-dom';
import s from './DashboardEmpresa.module.css';

function DashboardEmpresa() {
    return (
        <div className={s['dashboard']}>
            <h1 className={s['dashboard__title']}>Empresa - Dashboard</h1>
            <h2 className={s['dashboard__subtitle']}>
                Desde aquí podés administrar tus puestos y buscar candidatos
            </h2>
            <section className={s['dashboard__actions']}>
                <Link className={s['dashboard__link']} to="/empresa/puestos">
                    <button className={s['dashboard__action-btn']} type="button">
                        Ver mis puestos
                    </button>
                </Link>
                <Link className={s['dashboard__link']} to="/empresa/puestos/nuevo">
                    <button className={s['dashboard__action-btn']} type="button">
                        Publicar nuevo puesto
                    </button>
                </Link>
            </section>
        </div>
    );
}

export default DashboardEmpresa;
