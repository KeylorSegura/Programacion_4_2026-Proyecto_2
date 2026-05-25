package com.progra4.proyecto2backend.presentation.oferente;

import com.progra4.proyecto2backend.data.OferenteRepository;
import com.progra4.proyecto2backend.data.UsuarioRepository;
import com.progra4.proyecto2backend.logic.Oferente;
import com.progra4.proyecto2backend.logic.Usuario;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;


import org.springframework.web.bind.annotation.*;

import org.springframework.web.server.ResponseStatusException;

@RestController("oferente")
@RequestMapping("/api/oferente")
@CrossOrigin(origins = "*")
public class Controller {

    @Autowired
    private OferenteRepository oferentes;

    @Autowired
    private UsuarioRepository usuarios;


    @PostMapping("/registrar")
    public void create(@RequestBody Oferente oferente) {

        String nombreUsuario = oferente.getNombreUsuario().getId();

        String clave = oferente.getNombreUsuario() .getClave();

        if (usuarios.existsById(nombreUsuario)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "El nombre de usuario ya existe"
            );
        }

        Usuario usuario = new Usuario(nombreUsuario, clave,"Oferente");

        usuarios.save(usuario);

        oferente.setNombreUsuario(usuario);

        oferente.setEstado((byte) 0);

        oferentes.save(oferente);
    }
}