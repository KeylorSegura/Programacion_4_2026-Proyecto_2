package com.progra4.proyecto2backend.data;
import com.progra4.proyecto2backend.logic.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, String> {
}
