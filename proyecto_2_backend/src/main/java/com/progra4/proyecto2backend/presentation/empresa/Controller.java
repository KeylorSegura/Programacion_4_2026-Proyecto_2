package com.progra4.proyecto2backend.presentation.empresa;

import com.progra4.proyecto2backend.data.EmpresaRepository;
import com.progra4.proyecto2backend.data.UsuarioRepository;
import com.progra4.proyecto2backend.logic.Empresa;
import com.progra4.proyecto2backend.logic.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController("empresa")
@RequestMapping("/api/empresa")
@CrossOrigin(origins = "*")
public class Controller {

    @Autowired
    private UsuarioRepository usuarios;

    @Autowired
    private EmpresaRepository empresas;

    @PostMapping("/registrar")
    public void registrar(@RequestBody Map<String, String> body) {

        String nombreUsuario = body.get("nombreUsuario");

        if (usuarios.existsById(nombreUsuario)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }

        Usuario usuario = new Usuario();
        usuario.setId(nombreUsuario);
        usuario.setClave(body.get("clave"));
        usuario.setTipo("Empresa");
        usuarios.save(usuario);

        Empresa empresa = new Empresa();
        empresa.setNombreUsuario(usuario);
        empresa.setNombre(body.get("nombre"));
        empresa.setLocalizacion(body.get("localizacion"));
        empresa.setCorreoElectronico(body.get("correoElectronico"));
        empresa.setTelefono(body.get("telefono"));
        empresa.setDescripcion(body.get("descripcion"));
        empresa.setEstado((byte) 0);
        empresas.save(empresa);
    }
}
