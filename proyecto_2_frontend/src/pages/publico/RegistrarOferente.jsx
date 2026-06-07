import { useContext, useState } from "react";
import { AppContext } from "../../AppProvider";
import s from './Registro.module.css';
import AlertModal from '../../components/Modal/AlertModal';
import { httpErrorMessage } from '@/utils/httpErrors';

function RegistrarOferente() {

    const {
        oferenteState,
        setOferenteState
    } = useContext(AppContext);

    const backend = "http://localhost:8080/api";
    const [modal, setModal] = useState({ open: false, type: 'error', message: '' });

    function handleFieldChange(event) {

        const field = event.target;

        const value = field.value;

        const name = field.name;

        let oferente = {
            ...oferenteState.oferente
        };

        if (name === "id" || name === "clave") {

            oferente.nombreUsuario = {
                ...oferente.nombreUsuario,
                [name]: value
            };

        } else {

            oferente[name] = value;
        }

        setOferenteState({
            ...oferenteState,
            oferente: oferente
        });
    }

    async function handleSave(event) {

        event.preventDefault();

        const request = new Request(
            backend + "/publico/registrar/oferente",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    oferenteState.oferente
                )
            }
        );

        const response = await fetch(request);

        if (!response.ok) {

            setModal({ open: true, type: 'error', message: httpErrorMessage(response.status) });
            return;
        }

        setModal({ open: true, type: 'success', message: 'Oferente registrado' });

        setOferenteState({

            ...oferenteState,

            oferente: {

                nombreUsuario: {
                    id: "",
                    clave: ""
                },

                nombre: "",
                primerApellido: "",
                nacionalidad: "",
                telefono: "",
                correoElectronico: "",
                lugarResidencia: ""
            }
        });
    }

    return (

        <div className={s.main__container}>

            <h1 className={s.page__title}>Registrar Oferente</h1>

            {
                oferenteState.error &&
                (
                    <div className= {s.message__error}>
                        <p>{oferenteState.error}</p>
                    </div>
                )
            }

            <form className={s.form} onSubmit={handleSave}>

                <div className={s.form__section}>

                    <h3 className={s.form__section_title}>Datos de usuario</h3>

                    <label className={s.form__label} htmlFor="nombreUsuario">Nombre del usuario</label>

                    <input className={s.form__input} type="text" id="nombreUsuario" name="id" required value={oferenteState.oferente.nombreUsuario.id} onChange={handleFieldChange}/>

                    <label className={s.form__label} htmlFor="clave">Clave</label>

                    <input className={s.form__input} type="password" id="clave" name="clave" required value={oferenteState.oferente.nombreUsuario.clave} onChange={handleFieldChange}/>

                </div>

                <div className={s.form__section}>

                    <h3 className={s.form__section_title}>Datos del oferente</h3>

                    <label className={s.form__label} htmlFor="nombre">Nombre del oferente</label>

                    <input className={s.form__input} type="text" id="nombre" name="nombre" required value={oferenteState.oferente.nombre} onChange={handleFieldChange}/>

                    <label className={s.form__label} htmlFor="primerApellido">Primer apellido</label>

                    <input className={s.form__input} type="text" id="primerApellido" name="primerApellido" required value={oferenteState.oferente.primerApellido} onChange={handleFieldChange}/>

                    <label className={s.form__label} htmlFor="nacionalidad">Nacionalidad</label>

                    <input className={s.form__input} type="text" id="nacionalidad" name="nacionalidad" required value={oferenteState.oferente.nacionalidad} onChange={handleFieldChange}/>

                    <label className={s.form__label} htmlFor="telefono">Teléfono</label>

                    <input className={s.form__input} type="text" id="telefono" name="telefono" required value={oferenteState.oferente.telefono} onChange={handleFieldChange}/>

                    <label className={s.form__label} htmlFor="correoElectronico">Correo electrónico</label>

                    <input className={s.form__input} type="email" id="correoElectronico" name="correoElectronico" required value={oferenteState.oferente.correoElectronico} onChange={handleFieldChange}/>

                    <label className={s.form__label} htmlFor="lugarResidencia">Lugar de residencia</label>

                    <input className={s.form__input} type="text" id="lugarResidencia" name="lugarResidencia" required value={oferenteState.oferente.lugarResidencia} onChange={handleFieldChange}/>

                </div>

                <button className={s.form__button} type="submit">Guardar Oferente</button>

            </form>

            <AlertModal
                type={modal.type}
                message={modal.message}
                open={modal.open}
                onClose={() => setModal({ ...modal, open: false })}
            />
        </div>
    );
}

export default RegistrarOferente;