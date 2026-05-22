package com.progra4.proyecto2backend.presentation.publico;

import com.progra4.proyecto2backend.data.CaracteristicaRepository;
import com.progra4.proyecto2backend.data.PuestoRepository;
import com.progra4.proyecto2backend.logic.Caracteristica;
import com.progra4.proyecto2backend.logic.Puesto;
import com.progra4.proyecto2backend.logic.Puestocaracteristica;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@RestController("publico")
@RequestMapping("/api/publico")
@CrossOrigin(origins = "*")
public class Controller {

    @Autowired
    private PuestoRepository puestos;

    @Autowired
    private CaracteristicaRepository caracteristicas;

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

                    .sorted(
                            Comparator.comparing(
                                    Caracteristica::getNombre
                            )
                    )

                    .map(this::convertirCaracteristica)

                    .toList();

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND
            );
        }
    }

    @PostMapping("/filtrar")
    public List<Map<String, Object>> buscarPorCaracteristicas(
            @RequestBody List<Integer> caracteristicaIds
    ) {

        try {

            List<Set<Integer>> grupos = caracteristicaIds.stream()

                    .map(this::obtenerIdsConDescendientes)

                    .toList();

            return puestos.findAll().stream()

                    .filter(p ->
                            "Publica".equalsIgnoreCase(
                                    p.getTipoPublicacion()
                            )
                                    &&
                                    p.getActivo() == 1
                    )

                    .filter(puesto -> {

                        if (grupos.isEmpty()) {
                            return true;
                        }

                        Set<Integer> idsDelPuesto =

                                puesto.getPuestocaracteristicas().stream()

                                        .map(pc ->
                                                pc.getCaracteristica().getId()
                                        )

                                        .collect(Collectors.toSet());

                        return grupos.stream()

                                .allMatch(grupo ->

                                        grupo.stream()
                                                .anyMatch(idsDelPuesto::contains)
                                );
                    })

                    .sorted((p1, p2) ->
                            Integer.compare(
                                    p2.getId(),
                                    p1.getId()
                            )
                    )

                    .map(this::convertirPuesto)

                    .toList();

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    private Map<String, Object> convertirCaracteristica(
            Caracteristica c
    ) {

        Map<String, Object> map =
                new HashMap<>();

        map.put("id", c.getId());

        map.put("nombre", c.getNombre());

        List<Map<String, Object>> hijos =

                c.getCaracteristicas().stream()

                        .sorted(
                                Comparator.comparing(
                                        Caracteristica::getNombre
                                )
                        )

                        .map(this::convertirCaracteristica)

                        .toList();

        map.put("caracteristicas", hijos);

        return map;
    }

    private Map<String, Object> convertirPuesto(
            Puesto p
    ) {

        Map<String, Object> puestoMap =
                new HashMap<>();

        puestoMap.put("id", p.getId());

        puestoMap.put(
                "descripcion",
                p.getDescripcion()
        );

        puestoMap.put(
                "salario",
                p.getSalario()
        );

        Map<String, Object> empresaMap =
                new HashMap<>();

        if (p.getEmpresa() != null) {

            empresaMap.put(
                    "nombre",
                    p.getEmpresa().getNombre()
            );

        } else {

            empresaMap.put(
                    "nombre",
                    "No disponible"
            );
        }

        puestoMap.put(
                "empresa",
                empresaMap
        );

        List<Map<String, Object>> pcs =

                p.getPuestocaracteristicas().stream()

                        .map(this::convertirPuestoCaracteristica)

                        .toList();

        puestoMap.put(
                "puestocaracteristicas",
                pcs
        );

        return puestoMap;
    }

    private Map<String, Object> convertirPuestoCaracteristica(
            Puestocaracteristica pc
    ) {

        Map<String, Object> map =
                new HashMap<>();

        map.put(
                "nivel",
                pc.getNivel()
        );

        Map<String, Object> caracteristicaMap =
                new HashMap<>();

        caracteristicaMap.put(
                "id",
                pc.getCaracteristica().getId()
        );

        caracteristicaMap.put(
                "rutaCompleta",
                pc.getCaracteristica().getRutaCompleta()
        );

        map.put(
                "caracteristica",
                caracteristicaMap
        );

        return map;
    }

    private Set<Integer> obtenerIdsConDescendientes(
            Integer id
    ) {

        Set<Integer> resultado =
                new HashSet<>();

        Queue<Caracteristica> cola =
                new LinkedList<>();

        Caracteristica raiz =
                caracteristicas.findById(id).orElse(null);

        if (raiz == null) {
            return resultado;
        }

        cola.add(raiz);

        while (!cola.isEmpty()) {

            Caracteristica actual =
                    cola.poll();

            resultado.add(actual.getId());

            for (Caracteristica hijo :
                    actual.getCaracteristicas()) {

                cola.add(hijo);
            }
        }

        return resultado;
    }
}