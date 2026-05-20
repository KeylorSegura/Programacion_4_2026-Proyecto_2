package com.progra4.proyecto2backend.presentation.publico;

import com.progra4.proyecto2backend.data.CaracteristicaRepository;
import com.progra4.proyecto2backend.data.PuestoRepository;
import com.progra4.proyecto2backend.logic.Caracteristica;
import com.progra4.proyecto2backend.logic.Puesto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@RestController("publico")
@RequestMapping("/api/publico")
public class Controller {

    @Autowired
    private PuestoRepository puestos;

    @Autowired
    private CaracteristicaRepository caracteristicas;


    @GetMapping("/principal")
    public List<Puesto> ultimos5Puestos() {
        return puestos.findAll().stream()
                .filter(p -> p.getTipoPublicacion() != null
                        && p.getTipoPublicacion().equalsIgnoreCase("Publica"))
                .filter(p -> p.getActivo() != null
                        && p.getActivo() == 1)
                .sorted((p1, p2) -> Long.compare(p2.getId(), p1.getId()))
                .limit(5)
                .toList();
  }




    @GetMapping("/caracteristicas")
    public List<Caracteristica> getCaracteristicasRaiz() {

        try {
            List<Caracteristica> raices = caracteristicas.findRoots();

            ordenarRecursivo(raices);

            return raices;

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/puestos")
    public List<Puesto> buscarPorCaracteristicas(
            @RequestBody List<Integer> caracteristicaIds) {

        try {

            if (caracteristicaIds == null || caracteristicaIds.isEmpty()) {
                return new ArrayList<>();
            }

            List<Set<Integer>> grupos = caracteristicaIds.stream()
                    .map(this::obtenerIdsConDescendientes)
                    .toList();

            List<Puesto> todosPuestos = puestos.findAll();

            return todosPuestos.stream()
                    .filter(p -> "Publica".equalsIgnoreCase(p.getTipoPublicacion()))
                    .filter(puesto -> {

                        Set<Integer> idsDelPuesto =
                                puesto.getPuestocaracteristicas().stream()
                                        .map(pc -> pc.getCaracteristica().getId())
                                        .collect(Collectors.toSet());

                        return grupos.stream()
                                .allMatch(grupo ->
                                        grupo.stream().anyMatch(idsDelPuesto::contains));
                    })
                    .toList();

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
    }

    private void ordenarRecursivo(Collection<Caracteristica> nodos) {

        if (nodos == null) return;

        List<Caracteristica> lista = new ArrayList<>(nodos);

        lista.sort(Comparator.comparing(Caracteristica::getNombre));

        for (Caracteristica nodo : lista) {
            ordenarRecursivo(nodo.getCaracteristicas());
        }
    }

    private Set<Integer> obtenerIdsConDescendientes(Integer id) {

        Set<Integer> resultado = new HashSet<>();

        Queue<Caracteristica> cola = new LinkedList<>();

        Caracteristica raiz = caracteristicas.findById(id).orElse(null);

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