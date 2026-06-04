import { useNavigate } from 'react-router-dom';
import s from './BotonRegresar.module.css';

function BotonRegresar() {
    const navigate = useNavigate();
    return (
        <button className={s['boton-regresar']} type="button" onClick={() => navigate(-1)}>
            Regresar
        </button>
    );
}

export default BotonRegresar;
