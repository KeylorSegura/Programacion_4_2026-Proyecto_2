import { Link } from 'react-router-dom';
import s from './BotonRegresar.module.css';

function BotonRegresar({ to }) {
    return (
        <Link className={s['boton-regresar']} to={to}>
            Regresar
        </Link>
    );
}

export default BotonRegresar;
