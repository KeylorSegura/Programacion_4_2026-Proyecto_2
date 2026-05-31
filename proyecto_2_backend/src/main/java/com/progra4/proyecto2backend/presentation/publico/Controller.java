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

    private final TokenService tokenService;

    @PostMapping("/login")
    public String login(@RequestBody Usuario usuario) {
        try{
            Usuario ubd= usuarios.findById(usuario.getId()).get();
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            if(!encoder.matches(usuario.getClave(), ubd.getClave())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
            }
            return tokenService.generateToken(ubd);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/registrar/oferente")
    public void createOferente(@RequestBody Oferente oferente) {

        String nombreUsuario = oferente.getNombreUsuario().getId();

        String clave = oferente.getNombreUsuario() .getClave();

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String claveEncriptada = encoder.encode(clave);

        if (usuarios.existsById(nombreUsuario)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "El nombre de usuario ya existe"
            );
        }

        Usuario usuario = new Usuario(nombreUsuario, claveEncriptada,"Oferente");

        usuarios.save(usuario);

        oferente.setNombreUsuario(usuario);

        oferente.setEstado((byte) 0);

        oferentes.save(oferente);
    }

    @PostMapping("/registrar/empresa")
    public void createEmpresa(
            @RequestBody Empresa empresa
    ) {

        String nombreUsuario = empresa.getNombreUsuario().getId();

        String clave = empresa.getNombreUsuario().getClave();

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String claveEncriptada = encoder.encode(clave);

        if (usuarios.existsById(nombreUsuario)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El nombre de usuario ya existe"
            );
        }

        Usuario usuario = new Usuario(nombreUsuario, claveEncriptada, "Empresa");

        usuarios.save(usuario);

        empresa.setNombreUsuario(usuario);

        empresa.setEstado((byte) 0);

        empresas.save(empresa);
    }

    @GetMapping("/principal")
    public List<Map<String, Object>> ultimos5Puestos() {

        return puestos.findAll().stream()
                .filter(p ->
                        "Publica".equalsIgnoreCase(p.getTipoPublicacion())
                                && p.getActivo() == 1
                )
                .sorted((p1, p2) ->
                        Integer.compare(p2.getId(), p1.getId())
                )
                .limit(5)
                .map(this::convertirPuesto)
                .toList();
    }

    @GetMapping("/caracteristicas")
    public List<Map<String, Object>> getCaracteristicasRaiz() {
        try {
            return caracteristicas.findRoots().stream()
                    .sorted(Comparator.comparing(Caracteristica::getNombre))
                    .map(this::convertirCaracteristica)
                    .toList();
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND
            );
        }
    }

    @PostMapping("/filtrar")
    public List<Map<String, Object>> buscarPorCaracteristicas(@RequestBody List<Integer> caracteristicaIds) {
        try {
            List<Set<Integer>> grupos = caracteristicaIds.stream()
                    .map(this::obtenerIdsConDescendientes)
                    .toList();
            return puestos.findAll().stream()
                    .filter(p -> "Publica".equalsIgnoreCase(p.getTipoPublicacion()) && p.getActivo() == 1)
                    .filter(puesto -> {
                        if (grupos.isEmpty()) {
                            return true;
                        }
                        Set<Integer> idsDelPuesto = puesto.getPuestocaracteristicas().stream().map(pc ->pc.getCaracteristica().getId()).collect(Collectors.toSet());
                        return grupos.stream().allMatch(grupo -> grupo.stream().anyMatch(idsDelPuesto::contains));
                    })
                    .sorted((p1, p2) -> Integer.compare(p2.getId(), p1.getId()))
                    .map(this::convertirPuesto)
                    .toList();

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    private Map<String, Object> convertirCaracteristica(Caracteristica c) {

        Map<String, Object> map =new HashMap<>();
        map.put("id", c.getId());
        map.put("nombre", c.getNombre());
        List<Map<String, Object>> hijos =
                c.getCaracteristicas().stream()
                        .sorted(Comparator.comparing(Caracteristica::getNombre))
                        .map(this::convertirCaracteristica)
                        .toList();

        map.put("caracteristicas", hijos);

        return map;
    }

    private Map<String, Object> convertirPuesto(Puesto p) {

        Map<String, Object> puestoMap =new HashMap<>();
        puestoMap.put("id", p.getId());
        puestoMap.put("descripcion", p.getDescripcion());
        puestoMap.put("salario", p.getSalario());
        Map<String, Object> empresaMap = new HashMap<>();

        if (p.getEmpresa() != null) {
            empresaMap.put( "nombre", p.getEmpresa().getNombre());
        } else {
            empresaMap.put( "nombre", "No disponible");
        }
        puestoMap.put("empresa", empresaMap);
        List<Map<String, Object>> pcs =
                p.getPuestocaracteristicas().stream()
                        .map(this::convertirPuestoCaracteristica)
                        .toList();
        puestoMap.put("puestocaracteristicas", pcs );

        return puestoMap;
    }

    private Map<String, Object> convertirPuestoCaracteristica(Puestocaracteristica pc) {
        Map<String, Object> map = new HashMap<>();
        map.put("nivel",pc.getNivel());
        Map<String, Object> caracteristicaMap = new HashMap<>();
        caracteristicaMap.put("id", pc.getCaracteristica().getId());
        caracteristicaMap.put("rutaCompleta", pc.getCaracteristica().getRutaCompleta());
        map.put("caracteristica", caracteristicaMap);

        return map;
    }

    private Set<Integer> obtenerIdsConDescendientes(Integer id) {
        Set<Integer> resultado = new HashSet<>();
        Queue<Caracteristica> cola =  new LinkedList<>();
        Caracteristica raiz =  caracteristicas.findById(id).orElse(null);
        if (raiz == null) {
            return resultado;
        }
        cola.add(raiz);

        while (!cola.isEmpty()) {
            Caracteristica actual = cola.poll();

            resultado.add(actual.getId());

            for (Caracteristica hijo : actual.getCaracteristicas()) {
                cola.add(hijo);
            }
        }

        return resultado;
    }
}