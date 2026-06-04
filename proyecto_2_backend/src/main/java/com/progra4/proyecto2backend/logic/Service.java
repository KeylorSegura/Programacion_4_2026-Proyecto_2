package com.progra4.proyecto2backend.logic;

import com.progra4.proyecto2backend.data.CaracteristicaRepository;
import com.progra4.proyecto2backend.data.EmpresaRepository;
import com.progra4.proyecto2backend.data.OferenteRepository;
import com.progra4.proyecto2backend.data.PuestoRepository;
import com.progra4.proyecto2backend.data.PuestocaracteristicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@org.springframework.stereotype.Service
public class Service {

    @Autowired
    private PuestoRepository puestos;

    @Autowired
    private PuestocaracteristicaRepository puestocaracteristicas;

    @Autowired
    private CaracteristicaRepository caracteristicas;

    @Autowired
    private OferenteRepository oferentes;

    @Autowired
    private EmpresaRepository empresas;

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
}
