package com.progra4.proyecto2backend.presentation.oferente;

import com.progra4.proyecto2backend.data.OferenteRepository;
import com.progra4.proyecto2backend.data.UsuarioRepository;
import com.progra4.proyecto2backend.logic.Oferente;
import com.progra4.proyecto2backend.logic.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController("oferente")
@RequestMapping("/api/oferente")
@CrossOrigin(origins = "*")
public class Controller {

    @Autowired
    private UsuarioRepository usuarios;

    @Autowired
    private OferenteRepository oferentes;

    @PostMapping("/registrar")
    public void registrar(@RequestBody Map<String, String> body) {

        String nombreUsuario = body.get("nombreUsuario");

        if (usuarios.existsById(nombreUsuario)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }

        Usuario usuario = new Usuario();
        usuario.setId(nombreUsuario);
        usuario.setClave(body.get("clave"));
        usuario.setTipo("Oferente");
        usuarios.save(usuario);

        Oferente oferente = new Oferente();
        oferente.setNombreUsuario(usuario);
        oferente.setNombre(body.get("nombre"));
        oferente.setPrimerApellido(body.get("primerApellido"));
        oferente.setNacionalidad(body.get("nacionalidad"));
        oferente.setTelefono(body.get("telefono"));
        oferente.setCorreoElectronico(body.get("correoElectronico"));
        oferente.setLugarResidencia(body.get("lugarResidencia"));
        oferente.setEstado((byte) 0);
        oferentes.save(oferente);
    }
}
