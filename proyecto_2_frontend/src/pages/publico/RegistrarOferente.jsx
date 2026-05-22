import { useContext } from "react";
import { AppContext } from "../../AppProvider";

function RegistrarOferente() {

    const {
        oferenteState,
        setOferenteState
    } = useContext(AppContext);

    const backend = "http://localhost:8080/api";

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
            backend + "/oferente/registrar",
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

            alert("Error: " + response.status);
            return;
        }

        alert("Oferente registrado");

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

        <div className="main__container page">

            <h1 className="page__title">
                Registrar Oferente
            </h1>

            {
                oferenteState.error &&
                (
                    <div className="message--error">
                        <p>{oferenteState.error}</p>
                    </div>
                )
            }

            <form
                className="form"
                onSubmit={handleSave}
            >

                <div className="form__section form__section--usuario">

                    <h3 className="form__section-title">
                        Datos de usuario
                    </h3>

                    <label
                        className="form__label"
                        htmlFor="nombreUsuario"
                    >
                        Nombre del usuario
                    </label>

                    <input
                        className="form__input"
                        type="text"
                        id="nombreUsuario"
                        name="id"
                        required
                        value={
                            oferenteState
                                .oferente
                                .nombreUsuario
                                .id
                        }
                        onChange={handleFieldChange}
                    />

                    <label
                        className="form__label"
                        htmlFor="clave"
                    >
                        Clave
                    </label>

                    <input
                        className="form__input"
                        type="password"
                        id="clave"
                        name="clave"
                        required
                        value={
                            oferenteState
                                .oferente
                                .nombreUsuario
                                .clave
                        }
                        onChange={handleFieldChange}
                    />

                </div>

                <div className="form__section form__section--oferente">

                    <h3 className="form__section-title">
                        Datos del oferente
                    </h3>

                    <label
                        className="form__label"
                        htmlFor="nombre"
                    >
                        Nombre del oferente
                    </label>

                    <input
                        className="form__input"
                        type="text"
                        id="nombre"
                        name="nombre"
                        required
                        value={
                            oferenteState
                                .oferente
                                .nombre
                        }
                        onChange={handleFieldChange}
                    />

                    <label
                        className="form__label"
                        htmlFor="primerApellido"
                    >
                        Primer apellido
                    </label>

                    <input
                        className="form__input"
                        type="text"
                        id="primerApellido"
                        name="primerApellido"
                        required
                        value={
                            oferenteState
                                .oferente
                                .primerApellido
                        }
                        onChange={handleFieldChange}
                    />

                    <label
                        className="form__label"
                        htmlFor="nacionalidad"
                    >
                        Nacionalidad
                    </label>

                    <input
                        className="form__input"
                        type="text"
                        id="nacionalidad"
                        name="nacionalidad"
                        required
                        value={
                            oferenteState
                                .oferente
                                .nacionalidad
                        }
                        onChange={handleFieldChange}
                    />

                    <label
                        className="form__label"
                        htmlFor="telefono"
                    >
                        Teléfono
                    </label>

                    <input
                        className="form__input"
                        type="text"
                        id="telefono"
                        name="telefono"
                        required
                        value={
                            oferenteState
                                .oferente
                                .telefono
                        }
                        onChange={handleFieldChange}
                    />

                    <label
                        className="form__label"
                        htmlFor="correoElectronico"
                    >
                        Correo electrónico
                    </label>

                    <input
                        className="form__input"
                        type="email"
                        id="correoElectronico"
                        name="correoElectronico"
                        required
                        value={
                            oferenteState
                                .oferente
                                .correoElectronico
                        }
                        onChange={handleFieldChange}
                    />

                    <label
                        className="form__label"
                        htmlFor="lugarResidencia"
                    >
                        Lugar de residencia
                    </label>

                    <input
                        className="form__input"
                        type="text"
                        id="lugarResidencia"
                        name="lugarResidencia"
                        required
                        value={
                            oferenteState
                                .oferente
                                .lugarResidencia
                        }
                        onChange={handleFieldChange}
                    />

                </div>

                <button
                    className="form__button form__button--submit"
                    type="submit"
                >
                    Guardar Oferente
                </button>

            </form>

        </div>
    );
}

export default RegistrarOferente;