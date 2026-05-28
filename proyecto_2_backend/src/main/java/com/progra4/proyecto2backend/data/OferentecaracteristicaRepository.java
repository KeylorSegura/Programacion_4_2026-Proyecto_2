package com.progra4.proyecto2backend.data;

import com.progra4.proyecto2backend.logic.Caracteristica;
import com.progra4.proyecto2backend.logic.Oferente;
import com.progra4.proyecto2backend.logic.Oferentecaracteristica;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OferentecaracteristicaRepository extends JpaRepository<Oferentecaracteristica, Integer> {
    Oferentecaracteristica findByOferenteAndCaracteristica(Oferente oferente, Caracteristica caracteristica);
}
