import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './Login.module.css';

const BACKEND = 'http://localhost:8080';

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: '',
        clave: ''
    });

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
                alert("Error: " + response.status);
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
            alert("Error al iniciar sesión");
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
        </div>
    );
}

export default Login;