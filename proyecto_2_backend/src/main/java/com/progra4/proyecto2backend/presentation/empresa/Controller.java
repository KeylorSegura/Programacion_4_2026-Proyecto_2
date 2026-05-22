package com.progra4.proyecto2backend.presentation.empresa;

import com.progra4.proyecto2backend.data.EmpresaRepository;
import com.progra4.proyecto2backend.data.UsuarioRepository;

import com.progra4.proyecto2backend.logic.Empresa;
import com.progra4.proyecto2backend.logic.Usuario;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;

import org.springframework.web.bind.annotation.*;

import org.springframework.web.server.ResponseStatusException;

@RestController("empresa")
@RequestMapping("/api/empresa")
@CrossOrigin(origins = "*")
public class Controller {

    @Autowired
    private EmpresaRepository empresas;

    @Autowired
    private UsuarioRepository usuarios;

    @PostMapping("/registrar")
    public void create(
            @RequestBody Empresa empresa
    ) {

        String nombreUsuario =
                empresa.getNombreUsuario()
                        .getId();

        String clave =
                empresa.getNombreUsuario()
                        .getClave();

        if (usuarios.existsById(nombreUsuario)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El nombre de usuario ya existe"
            );
        }

        Usuario usuario = new Usuario(
                nombreUsuario,
                clave,
                "Empresa"
        );

        usuarios.save(usuario);

        empresa.setNombreUsuario(usuario);

        empresa.setEstado((byte) 0);

        empresas.save(empresa);
    }
}