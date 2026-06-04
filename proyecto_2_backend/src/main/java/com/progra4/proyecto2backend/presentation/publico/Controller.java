package com.progra4.proyecto2backend.presentation.publico;

import com.progra4.proyecto2backend.data.*;
import com.progra4.proyecto2backend.logic.*;
import com.progra4.proyecto2backend.presentation.security.TokenService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@RestController("publico")
@RequestMapping("/api/publico")
@CrossOrigin(origins = "*")
@AllArgsConstructor
public class Controller {

    @Autowired
    private PuestoRepository puestos;

    @Autowired
    private CaracteristicaRepository caracteristicas;

    @Autowired
    private EmpresaRepository empresas;

    @Autowired
    private OferenteRepository oferentes;

    @Autowired
    private UsuarioRepository usuarios;

    @Autowired
    private Service service;

    private final TokenService tokenService;

    @PostMapping("/login")
    public String login(@RequestBody Usuario usuario) {
        return service.login(usuario);
    }

    @PostMapping("/registrar/oferente")
    public void createOferente(@RequestBody Oferente oferente) {
        service.createOferente(oferente);
    }

    @PostMapping("/registrar/empresa")
    public void createEmpresa(@RequestBody Empresa empresa) {
        service.createEmpresa(empresa);
    }

    @GetMapping("/principal")
    public List<Map<String, Object>> ultimos5Puestos() {
        return service.ultimos5Puestos();
    }

    @GetMapping("/caracteristicas")
    public List<Map<String, Object>> getCaracteristicasRaiz() {
        return service.getCaracteristicaRaiz();
    }

    @PostMapping("/filtrar")
    public List<Map<String, Object>> buscarPorCaracteristicas(@RequestBody List<Integer> caracteristicaIds) {
        return service.buscarPorCaracteristicas(caracteristicaIds);
    }


}