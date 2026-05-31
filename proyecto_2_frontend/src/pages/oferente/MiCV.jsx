import { useContext, useEffect } from "react";
import { AppContext } from "../../AppProvider";
import s from "./MiCV.module.css";

function MiCV() {

    const {
        cvState,
        setCvState
    } = useContext(AppContext);

    const backend = "http://localhost:8080/api";

    const usuarioId = "key";


    function handleTieneCV() {

        const request = new Request(
            backend + "/oferente/cv/existe/" + usuarioId,
            {
                method: "GET",
                headers: {}
            }
        );

        (async () => {

            const response = await fetch(request);

            if (!response.ok) {
                alert("Error: " + response.status);
                return;
            }

            const tieneCV = await response.json();

            setCvState({
                ...cvState,
                tieneCV: tieneCV
            });

        })();
    }

    useEffect(() => {

        handleTieneCV();

    }, []);
    function handleFileChange(event) {

        const archivo = event.target.files[0];

        setCvState({
            ...cvState,
            archivo: archivo
        });
    }

    function handleSubir(event) {

        event.preventDefault();

        if (cvState.archivo == null) {
            alert("Debe seleccionar un archivo");
            return;
        }

        const formData = new FormData();

        formData.append("archivo", cvState.archivo);

        const request = new Request(
            backend + "/oferente/cv/subir/" + usuarioId,
            {
                method: "POST",
                body: formData
            }
        );

        (async () => {
            const response = await fetch(request);
            if (!response.ok) {
                alert("Error: " + response.status);
                return;
            }
            alert("CV subido correctamente");

            setCvState({
                archivo: null,
                tieneCV: true
            });

        })();
    }

    function handleVerCV() {
        window.open(backend + "/oferente/cv/ver/" + usuarioId, "_blank");
    }

    return (
        <div className={s.page}>

            <h1 className={s.page__title}> Mi CV</h1>

            <form className={s["cv-form"]}onSubmit={handleSubir}>
                <div className={s["cv-form__field"]}>
                    <label className={s["cv-form__label"]}>Archivo PDF</label>
                    <input className={s["cv-form__file"]} type="file" accept="application/pdf" onChange={handleFileChange}/>
                </div>
                {
                    cvState.archivo != null &&
                    <p>Archivo seleccionado:{" "}{cvState.archivo.name}</p>
                }

                <div className={s["cv-form__actions"]}>
                    <button className={s["cv-form__button"] + " " + s["cv-form__button--submit"]} type="submit">Subir</button>
                </div>

            </form>

            <div className={s["cv-status"]}>

                {
                    cvState.tieneCV
                        ?
                        <p className={s["cv-status__message"]}>Ya existe un CV cargado</p>
                        :
                        <p className={s["cv-status__message"]}>No existe ningún CV cargado</p>
                }

                <div className={s["cv-status__actions"]}>
                    <button className={s["cv-status__button"]} type="button" disabled={!cvState.tieneCV} onClick={handleVerCV}>Ver CV</button>
                </div>

            </div>

        </div>
    );
}

export default MiCV;