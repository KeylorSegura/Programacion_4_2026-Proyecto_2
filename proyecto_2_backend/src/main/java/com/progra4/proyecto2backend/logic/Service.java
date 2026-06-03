package com.progra4.proyecto2backend.logic;

import com.progra4.proyecto2backend.data.CaracteristicaRepository;
import com.progra4.proyecto2backend.data.EmpresaRepository;
import com.progra4.proyecto2backend.data.OferenteRepository;
import com.progra4.proyecto2backend.data.PuestoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;

@org.springframework.stereotype.Service
public class Service {

    @Autowired
    private PuestoRepository puestos;

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








}
