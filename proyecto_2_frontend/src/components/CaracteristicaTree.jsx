import s from './CaracteristicaTree.module.css';

function CaracteristicaTree({ nodo }) {
    return (
        <div className={s['caracteristica-nodo']}>
            <details className={s['caracteristica-nodo__detalle']}>
                <summary className={s['caracteristica-nodo__resumen']}>
                    <input
                        className={s['caracteristica-nodo__checkbox']}
                        type="checkbox"
                        name="caracteristicaIds"
                        value={nodo.id}
                    />
                    <span className={s['caracteristica-nodo__nombre']}>{nodo.nombre}</span>
                    <label className={s['caracteristica-nodo__nivel-label']}>
                        Nivel:
                        <input
                            className={s['caracteristica-nodo__nivel-input']}
                            type="number"
                            name={`nivel_${nodo.id}`}
                            min="1"
                            max="5"
                            defaultValue="1"
                        />
                    </label>
                </summary>
                {nodo.caracteristicas && nodo.caracteristicas.length > 0 && (
                    <div className={s['caracteristica-nodo__hijos']}>
                        {nodo.caracteristicas
                            .filter(hijo => hijo.id !== nodo.id)
                            .map(hijo => (
                                <CaracteristicaTree key={hijo.id} nodo={hijo} />
                            ))}
                    </div>
                )}
            </details>
        </div>
    );
}

export default CaracteristicaTree;
