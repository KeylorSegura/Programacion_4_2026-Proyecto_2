import { useContext, useEffect, useRef } from "react";
import { AppContext } from "../../AppProvider";
import s from "./MiCV.module.css";

function MiCV() {

    const {
        cvState,
        setCvState
    } = useContext(AppContext);

    const backend = "http://localhost:8080/api";

    const archivo = useRef();




    function handleTieneCV() {

        const request = new Request(
            backend + "/oferente/cv/existe/" + JSON.parse(atob(localStorage.getItem("token").split('.')[1])).id,
            {
                method: "GET",
                headers: {'Authorization': 'Bearer '+localStorage.getItem('token')}
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

    function handleSubir(event) {

        event.preventDefault();

        if (archivo.current.files.length === 0) {
            alert("Debe seleccionar un archivo");
            return;
        }

        const formData = new FormData();

        formData.append("archivo", archivo.current.files[0]);

        const request = new Request(
            backend + "/oferente/cv/subir/" + JSON.parse(atob(localStorage.getItem("token").split('.')[1])).id,
            {
                method: "POST",
                headers: {'Authorization': 'Bearer '+localStorage.getItem('token')},
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
                ...cvState,
                tieneCV: true
            });

        })();
    }

    async function handleVerCV() {

        const response = await fetch(
            backend + "/oferente/cv/ver/" +
            JSON.parse(atob(localStorage.getItem("token").split('.')[1])).id,
            {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }
        );

        if (!response.ok) {
            alert("Error: " + response.status);
            return;
        }

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);

        window.open(url, "_blank");
    }

    return (
        <div className={s.page}>

            <h1 className={s.page__title}> Mi CV</h1>

            <form className={s["cv-form"]} onSubmit={handleSubir}>
                <div className={s["cv-form__field"]}>
                    <label className={s["cv-form__label"]}>Archivo PDF</label>
                    <input
                        className={s["cv-form__file"]}
                        type="file"
                        accept="application/pdf"
                        ref={archivo}
                    />
                </div>

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