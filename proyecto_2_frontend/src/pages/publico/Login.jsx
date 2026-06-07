import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './Login.module.css';
import AlertModal from '../../components/Modal/AlertModal';

const BACKEND = 'http://localhost:8080';

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: '',
        clave: ''
    });
    const [error, setError] = useState('');
    const [modal, setModal] = useState({ open: false, message: '' });

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleLogin(e) {
        e.preventDefault();

        try {
            const response = await fetch(BACKEND + '/api/publico/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {

                const errorData = await response.json();

                setError(errorData.message);

                return;
            }

            const token = await response.text();
            localStorage.setItem("token", token);

            const payload = JSON.parse(atob(token.split('.')[1]));
            const tipo = Array.isArray(payload.scope) ? payload.scope[0] : payload.scope;

            switch (tipo) {
                case 'Empresa':
                    navigate('/empresa/dashboard');
                    break;
                case 'Oferente':
                    navigate('/oferente/dashboard');
                    break;
                case 'Administrador':
                    navigate('/admin/dashboard');
                    break;
                default:
                    navigate('/');
            }

        } catch (error) {
            console.error(error);
            setModal({ open: true, message: 'Error al iniciar sesión' });
        }
    }

    return (
        <div className={s['form-container']}>
            <h2>Log in</h2>

            <form className={s.form} onSubmit={handleLogin}>

                <div>
                    <div className={s.label}> Usuario </div>

                    <div className={s.field}>
                        <input
                            type="text"
                            id="id"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div>
                    <div className={s.label}>Clave</div>

                    <div className={s.field}>
                        <input
                            type="password"
                            id="clave"
                            name="clave"
                            value={formData.clave}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <br/>

                <div className={s.section}>
                    <input
                        type="submit"
                        value="Login"
                        className={s.button}
                    />
                </div>

            </form>

            {error && (
                <div className={s.error}>
                    {error}
                </div>
            )}

            <AlertModal
                type="error"
                message={modal.message}
                open={modal.open}
                onClose={() => setModal(m => ({ ...m, open: false }))}
            />
        </div>
    );
}

export default Login;