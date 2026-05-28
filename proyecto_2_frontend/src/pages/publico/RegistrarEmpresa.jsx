import { useContext } from "react";
import { AppContext } from "../../AppProvider";
import s from './Registro.module.css';

function RegistrarEmpresa() {

    const {
        empresaState,
        setEmpresaState
    } = useContext(AppContext);

    const backend = "http://localhost:8080/api";

    function handleFieldChange(event) {
        const field = event.target;
        const value = field.value;
        const name = field.name;

        let empresa = {
            ...empresaState.empresa
        };
        if (name === "id" || name === "clave") {
            empresa.nombreUsuario = {
                ...empresa.nombreUsuario,
                [name]: value
            };
        } else {
            empresa[name] = value;
        }
        setEmpresaState({
            ...empresaState,
            empresa: empresa
        });
    }

    async function handleSave(event) {
        event.preventDefault();
        const request = new Request(
            backend + "/publico/registrar/empresa",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    empresaState.empresa
                )
            }
        );
        const response = await fetch(request);
        if (!response.ok) {
            alert("Error: " + response.status);
            return;
        }
        alert("Empresa registrada");
        setEmpresaState({
            ...empresaState,
            empresa: {

                nombreUsuario: {
                    id: "",
                    clave: ""
                },

                nombre: "",
                localizacion: "",
                correoElectronico: "",
                telefono: "",
                descripcion: ""
            }
        });
    }

    return (
        <div className={s.main__container}>
            <h1 className={s.page__title}>Registrar Empresa</h1>
            {
                empresaState.error &&
                (
                    <div className={s.message__error}>
                        <p>{empresaState.error}</p>
                    </div>
                )
            }

            <form className={s.form} onSubmit={handleSave}>
                <div className={s.form__section}>
                    <h3 className={s.form__section_title}>Datos de usuario</h3>
                    <label className={s.form__label} htmlFor="nombreUsuario">Nombre del usuario</label>
                    <input className={s.form__input} type="text" id="nombreUsuario" name="id" required value={empresaState.empresa.nombreUsuario.id} onChange={handleFieldChange}/>

                    <label className={s.form__label} htmlFor="clave">Clave</label>

                    <input className={s.form__input} type="password" id="clave" name="clave" required value={empresaState.empresa.nombreUsuario.clave} onChange={handleFieldChange}/>

                </div>

                <div className={s.form__section}>

                    <h3 className={s.form__section_title}>Datos de la empresa</h3>

                    <label className={s.form__label} htmlFor="nombre">Nombre de la empresa</label>

                    <input className={s.form__input} type="text" id="nombre" name="nombre" required value={empresaState.empresa.nombre} onChange={handleFieldChange}/>

                    <label className={s.form__label} htmlFor="localizacion">Localización</label>

                    <input className={s.form__input} type="text" id="localizacion" name="localizacion" required value={empresaState.empresa.localizacion} onChange={handleFieldChange}/>

                    <label className={s.form__label} htmlFor="correoElectronico">Correo electrónico</label>

                    <input className={s.form__input} type="email" id="correoElectronico" name="correoElectronico" required value={empresaState.empresa.correoElectronico} onChange={handleFieldChange}/>

                    <label className={s.form__label} htmlFor="telefono">Teléfono</label>

                    <input className={s.form__input} type="text" id="telefono" name="telefono" required value={empresaState.empresa.telefono} onChange={handleFieldChange}/>

                    <label className={s.form__label} htmlFor="descripcion">Descripción</label>

                    <textarea className={s.form__textarea} id="descripcion" name="descripcion" required value={empresaState.empresa.descripcion} onChange={handleFieldChange}/>

                </div>

                <button className={s.form__button} type="submit">Guardar Empresa</button>

            </form>

        </div>
    );
}

export default RegistrarEmpresa;