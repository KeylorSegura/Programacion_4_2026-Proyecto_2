package com.progra4.proyecto2backend.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.progra4.proyecto2backend.logic.Caracteristica;

import java.util.List;

public interface CaracteristicaRepository extends JpaRepository<Caracteristica, Integer> {
    @Query("SELECT c FROM Caracteristica c WHERE c.padre IS NULL")
    List<Caracteristica> findRoots();

    List<Caracteristica> padre(Caracteristica padre);

    List<Caracteristica> findByPadreIsNull();

    List<Caracteristica> findByPadreId(Integer padreId);
}
