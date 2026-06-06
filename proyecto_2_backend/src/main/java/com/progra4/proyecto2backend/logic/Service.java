package com.progra4.proyecto2backend.logic;

import com.progra4.proyecto2backend.data.*;
import com.progra4.proyecto2backend.presentation.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import com.progra4.proyecto2backend.presentation.security.TokenService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import lombok.AllArgsConstructor;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;


@AllArgsConstructor
@org.springframework.stereotype.Service
public class Service {

    @Autowired
    private PuestoRepository puestos;

    @Autowired
    private UsuarioRepository usuarios;

    @Autowired
    private PuestocaracteristicaRepository puestocaracteristicas;

    @Autowired
    private OferentecaracteristicaRepository oferenteCaracteristicas;

    @Autowired
    private CaracteristicaRepository caracteristicas;

    @Autowired
    private OferenteRepository oferentes;

    @Autowired
    private EmpresaRepository empresas;


    private final TokenService tokenService;


    public List<Empresa> empresasPendientes() {
        return empresas.findByEstado((byte) 0);
    }

    public List<Oferente> oferentesPendientes() {
        return oferentes.findByEstado((byte) 0);
    }

    public void autorizarEmpresa(Integer id) {
        Empresa e = empresas.findById(id).orElseThrow();
        e.setEstado((byte) 1);

        empresas.save(e);
    }

    public void autorizarOferente(String id) {
        Oferente o = oferentes.findById(id).orElseThrow();
        o.setEstado((byte) 1);
        oferentes.save(o);
    }

    public List<Caracteristica> getCaracteristicasRaiz() {
        List<Caracteristica> raices = caracteristicas.findRoots();

        ordenarRecursivo(raices);

        return raices;
    }

    private void ordenarRecursivo(Collection<Caracteristica> nodos) {
        if (nodos == null) return;
        List<Caracteristica> lista = new ArrayList<>(nodos);
        lista.sort(Comparator.comparing(Caracteristica::getNombre));
        for (Caracteristica nodo : lista) {
            ordenarRecursivo(nodo.getCaracteristicas());
        }
    }

    public List<Caracteristica> findCaracteristicas(){
        return caracteristicas.findAll();
    }

    public void crearCaracteristica(String nombre, Integer padreId){
        Caracteristica caracteristica = new Caracteristica();
        caracteristica.setNombre(nombre);

        if (padreId == null){
            caracteristica.setPadre(null);
            caracteristicas.save(caracteristica);
        }
        else{
            Caracteristica padre = caracteristicas.findById(padreId).orElseThrow(() -> new RuntimeException("Padre no existe"));
            caracteristica.setPadre(padre);
            caracteristicas.save(caracteristica);
        }
    }

    public void crearPuesto(String usuarioId, String descripcion, Float salario, String tipoPublicacion, Map<Integer, Integer> niveles) {
        Empresa empresa = empresas.findByNombreUsuarioId(usuarioId);

        if (empresa == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Empresa no encontrada");
        }

        Puesto puesto = new Puesto();
        puesto.setEmpresa(empresa);
        puesto.setDescripcion(descripcion);
        puesto.setSalario(salario);
        puesto.setTipoPublicacion(tipoPublicacion);
        puesto.setActivo((byte) 1);

        puestos.save(puesto);

        for (Map.Entry<Integer, Integer> entrada : niveles.entrySet()) {
            Caracteristica caracteristica = caracteristicas.findById(entrada.getKey())
                    .orElseThrow(() -> new RuntimeException("Característica no existe"));

            Puestocaracteristica puestocaracteristica = new Puestocaracteristica();
            puestocaracteristica.setPuesto(puesto);
            puestocaracteristica.setCaracteristica(caracteristica);
            puestocaracteristica.setNivel(entrada.getValue());

            puestocaracteristicas.save(puestocaracteristica);
        }
    }

    public List<Puesto> getPuestosEmpresa(String usuarioId) {
        Empresa empresa = empresas.findByNombreUsuarioId(usuarioId);

        if (empresa == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Empresa no encontrada");
        }

        return empresa.getPuestos().stream()
                .sorted(Comparator.comparing(Puesto::getId))
                .toList();
    }

    public void activarPuesto(String usuarioId, Integer puestoId) {
        cambiarEstadoPuesto(usuarioId, puestoId, (byte) 1);
    }

    public void desactivarPuesto(String usuarioId, Integer puestoId) {
        cambiarEstadoPuesto(usuarioId, puestoId, (byte) 0);
    }

    private void cambiarEstadoPuesto(String usuarioId, Integer puestoId, byte estado) {
        Empresa empresa = empresas.findByNombreUsuarioId(usuarioId);

        if (empresa == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Empresa no encontrada");
        }

        Puesto puesto = puestos.findById(puestoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Puesto no encontrado"));

        if (!puesto.getEmpresa().getId().equals(empresa.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        puesto.setActivo(estado);

        puestos.save(puesto);
    }

    public Map<String, Object> getCandidatos(String usuarioId, Integer puestoId) {
        Empresa empresa = empresas.findByNombreUsuarioId(usuarioId);

        if (empresa == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Empresa no encontrada");
        }

        Puesto puesto = puestos.findById(puestoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Puesto no encontrado"));

        if (!puesto.getEmpresa().getId().equals(empresa.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        Map<Integer, Integer> requisitos = new LinkedHashMap<>();
        for (Puestocaracteristica pc : puesto.getPuestocaracteristicas()) {
            requisitos.put(pc.getCaracteristica().getId(), pc.getNivel());
        }

        int totalRequisitos = requisitos.size();

        List<Map<String, Object>> candidatos = new ArrayList<>();

        for (Oferente oferente : oferentes.findAll()) {
            Map<Integer, Integer> nivelesOferente = new HashMap<>();
            for (Oferentecaracteristica oc : oferente.getOferentecaracteristicas()) {
                nivelesOferente.put(oc.getCaracteristica().getId(), oc.getNivel());
            }

            int cumplidos = 0;
            for (Map.Entry<Integer, Integer> requisito : requisitos.entrySet()) {
                if (!nivelesOferente.containsKey(requisito.getKey())) {
                    continue;
                }

                Integer nivelRequerido = requisito.getValue();
                Integer nivelOferente = nivelesOferente.get(requisito.getKey());

                int nivelOfrecido = nivelOferente == null ? 0 : nivelOferente;

                if (nivelRequerido == null || nivelOfrecido >= nivelRequerido) {
                    cumplidos++;
                }
            }

            if (cumplidos == 0) {
                continue;
            }

            int porcentaje = totalRequisitos == 0
                    ? 0
                    : Math.round((cumplidos * 100f) / totalRequisitos);

            Map<String, Object> candidato = new LinkedHashMap<>();
            candidato.put("id", oferente.getId());
            candidato.put("nombre", oferente.getNombre());
            candidato.put("primerApellido", oferente.getPrimerApellido());
            candidato.put("requisitosCumplidos", cumplidos);
            candidato.put("totalRequisitos", totalRequisitos);
            candidato.put("porcentajeCoincidencia", porcentaje);

            candidatos.add(candidato);
        }

        candidatos.sort((a, b) -> Integer.compare(
                (int) b.get("porcentajeCoincidencia"),
                (int) a.get("porcentajeCoincidencia")));

        Map<String, Object> puestoMap = new LinkedHashMap<>();
        puestoMap.put("id", puesto.getId());
        puestoMap.put("descripcion", puesto.getDescripcion());

        Map<String, Object> respuesta = new LinkedHashMap<>();
        respuesta.put("puesto", puestoMap);
        respuesta.put("candidatos", candidatos);

        return respuesta;
    }

    public Oferente getOferenteById(Integer id) {
        return oferentes.findById(String.valueOf(id))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Oferente no encontrado"));
    }

    public Map<String, Object> getDetalleOferente(Integer id) {
        Oferente oferente = getOferenteById(id);

        List<Map<String, Object>> habilidades = oferente.getOferentecaracteristicas().stream()
                .sorted(Comparator.comparing(oc -> oc.getCaracteristica().getNombre()))
                .map(oc -> {
                    Map<String, Object> caracteristica = new LinkedHashMap<>();
                    caracteristica.put("id", oc.getCaracteristica().getId());
                    caracteristica.put("nombre", oc.getCaracteristica().getNombre());

                    Map<String, Object> habilidad = new LinkedHashMap<>();
                    habilidad.put("caracteristica", caracteristica);
                    habilidad.put("nivel", oc.getNivel());

                    return habilidad;
                })
                .toList();

        Map<String, Object> detalle = new LinkedHashMap<>();
        detalle.put("id", oferente.getId());
        detalle.put("nombre", oferente.getNombre());
        detalle.put("primerApellido", oferente.getPrimerApellido());
        detalle.put("correoElectronico", oferente.getCorreoElectronico());
        detalle.put("telefono", oferente.getTelefono());
        detalle.put("lugarResidencia", oferente.getLugarResidencia());
        detalle.put("oferentecaracteristicas", habilidades);

        return detalle;
    }








    public String construirRutaCaracteristica(Caracteristica c) {
        if (c.getPadre() == null) {
            return c.getNombre();
        }
        return construirRutaCaracteristica(c.getPadre())
                + " / "
                + c.getNombre();
    }

    public List<Map<String, Object>> readHabilidades(String usuarioId) {

        Oferente oferente = oferentes.findByNombreUsuarioId(usuarioId);

        if (oferente == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        return oferente.getOferentecaracteristicas()
                .stream()
                .sorted((oc1, oc2) -> construirRutaCaracteristica(oc1.getCaracteristica()).compareTo(construirRutaCaracteristica(oc2.getCaracteristica())))
                .map(oc -> Map.<String, Object>of("ruta", construirRutaCaracteristica(oc.getCaracteristica()), "nivel", oc.getNivel()))
                .toList();
    }

    public List<Map<String, Object>> readSubcategorias(Integer padreId) {

        return caracteristicas.findByPadreId(padreId)
                .stream()
                .map(c -> Map.<String, Object>of("id", c.getId(), "nombre", c.getNombre()))
                .toList();
    }

    public List<Map<String, Object>> readRuta(Integer padreId) {
        List<Caracteristica> lista;

        if (padreId == 0) {
            lista = caracteristicas.findRoots();
        } else {
            lista = caracteristicas.findByPadreId(padreId);
        }

        return lista.stream()
                .map(c -> Map.<String, Object>of("id", c.getId(), "nombre", c.getNombre()))
                .toList();
    }

    public void agregarHabilidad(String usuarioId, Integer caracteristicaId, Integer nivel) {
        Oferente oferente = oferentes.findByNombreUsuarioId(usuarioId);

        Caracteristica caracteristica = caracteristicas.findById(caracteristicaId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        Oferentecaracteristica existente = oferenteCaracteristicas.findByOferenteAndCaracteristica(oferente, caracteristica);

        if (existente != null) {
            existente.setNivel(nivel);
            oferenteCaracteristicas.save(existente);
        } else {
            Oferentecaracteristica nueva = new Oferentecaracteristica();
            nueva.setOferente(oferente);
            nueva.setCaracteristica(caracteristica);
            nueva.setNivel(nivel);
            oferenteCaracteristicas.save(nueva);
        }
    }

    public boolean existeCV(String usuarioId) {
        Oferente oferente = oferentes.findByNombreUsuarioId(usuarioId);
        byte[] cv = oferente.getCurriculum();
        return cv != null && cv.length > 0;
    }

    public void subirCV(String usuarioId, MultipartFile archivo) {
        try {
            Oferente oferente = oferentes.findByNombreUsuarioId(usuarioId);
            oferente.setCurriculum(archivo.getBytes());
            oferentes.save(oferente);
        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public byte[] obtenerCV(String usuarioId) {
        Oferente oferente = oferentes.findByNombreUsuarioId(usuarioId);
        byte[] pdf = oferente.getCurriculum();
        if (pdf == null || pdf.length == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return pdf;
    }





    public String login(Usuario usuario) {

        try {
            Usuario ubd = usuarios.findById(usuario.getId()).get();

            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

            if (!encoder.matches(usuario.getClave(), ubd.getClave())) {

                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Clave o usuario incorrecto");
            }

            boolean enabled = true;

            if ("Empresa".equals(ubd.getTipo())) {

                Empresa empresa = empresas.findByNombreUsuarioId(ubd.getId());
                enabled = empresa != null && Byte.valueOf((byte)1).equals(empresa.getEstado());
            }

            if ("Oferente".equals(ubd.getTipo())) {

                Oferente oferente = oferentes.findByNombreUsuarioId(ubd.getId());

                enabled = oferente != null && Byte.valueOf((byte)1).equals(oferente.getEstado());
            }

            if (!enabled) {

                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario sin autorizar");
            }

            return tokenService.generateToken(ubd);

        }
        catch (ResponseStatusException e) {
            throw e;
        }
        catch (Exception e) {

            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Clave o usuario incorrecto"
            );
        }
    }

    public void createOferente(Oferente oferente) {
        String nombreUsuario = oferente.getNombreUsuario().getId();
        String clave = oferente.getNombreUsuario().getClave();
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String claveEncriptada = encoder.encode(clave);
        if (usuarios.existsById(nombreUsuario)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El nombre de usuario ya existe"
            );
        }
        Usuario usuario = new Usuario(nombreUsuario, claveEncriptada, "Oferente");
        usuarios.save(usuario);
        oferente.setNombreUsuario(usuario);
        oferente.setEstado((byte) 0);
        oferentes.save(oferente);
    }

    public void createEmpresa(Empresa empresa) {
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

    public List<Map<String, Object>> ultimos5Puestos() {

        return puestos.findAll().stream().filter(p -> "Publica".equalsIgnoreCase(p.getTipoPublicacion()) && p.getActivo() == 1)
                .sorted((p1, p2) -> Integer.compare(p2.getId(), p1.getId()))
                .limit(5)
                .map(this::convertirPuesto)
                .toList();
    }

    public List<Map<String, Object>> getCaracteristicaRaiz() {
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

    public List<Map<String, Object>> buscarPorCaracteristicas(List<Integer> caracteristicaIds) {
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
                        Set<Integer> idsDelPuesto = puesto.getPuestocaracteristicas().stream().map(pc -> pc.getCaracteristica().getId()).collect(Collectors.toSet());
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
