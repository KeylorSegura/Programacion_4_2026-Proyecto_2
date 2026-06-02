package com.progra4.proyecto2backend.logic;

import com.progra4.proyecto2backend.data.CaracteristicaRepository;
import com.progra4.proyecto2backend.data.EmpresaRepository;
import com.progra4.proyecto2backend.data.OferenteRepository;
import com.progra4.proyecto2backend.data.PuestoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

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




}
