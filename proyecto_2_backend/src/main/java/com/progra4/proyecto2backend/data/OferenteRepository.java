package com.progra4.proyecto2backend.data;

import com.progra4.proyecto2backend.logic.Oferente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OferenteRepository extends JpaRepository<Oferente, String> {
    List<Oferente> findByEstado(int estado);
    Oferente findByNombreUsuarioId(String nombreUsuarioId);
}
