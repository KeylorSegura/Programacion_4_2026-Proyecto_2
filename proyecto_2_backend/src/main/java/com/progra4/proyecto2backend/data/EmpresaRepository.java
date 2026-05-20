package com.progra4.proyecto2backend.data;

import com.progra4.proyecto2backend.logic.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmpresaRepository extends JpaRepository<Empresa, Integer> {
    List<Empresa> findByEstado(int estado);
    Empresa findByNombreUsuarioId(String nombreUsuarioId);
}
