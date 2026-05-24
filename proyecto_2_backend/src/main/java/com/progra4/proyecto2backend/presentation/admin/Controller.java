package com.progra4.proyecto2backend.presentation.admin;

import com.progra4.proyecto2backend.data.EmpresaRepository;
import com.progra4.proyecto2backend.data.CaracteristicaRepository;
import com.progra4.proyecto2backend.data.OferenteRepository;

import com.progra4.proyecto2backend.data.PuestoRepository;
import com.progra4.proyecto2backend.logic.Empresa;
import com.progra4.proyecto2backend.logic.Oferente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController("admin")
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class Controller {

    @Autowired
    private PuestoRepository puestos;

    @Autowired
    private CaracteristicaRepository caracteristicas;

    @Autowired
    private OferenteRepository oferentes;

    @Autowired
    private EmpresaRepository empresas;

    @GetMapping("/empresas-pendientes")
    public List<Empresa> empresasPendientes() {

        return empresas.findByEstado((byte) 0);
    }

    @GetMapping("/oferentes-pendientes")
    public List<Oferente> oferentesPendientes() {

        return oferentes.findByEstado((byte) 0);
    }

    @PostMapping("/autorizarEmpresa/{id}")
    public void autorizarEmpresa(@PathVariable Integer id) {

        try {
            Empresa e = empresas.findById(id).orElseThrow();
            e.setEstado((byte) 1);

            empresas.save(e);

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND
            );
        }
    }

    @PostMapping("/autorizarOferente/{id}")
    public void autorizarOferente(@PathVariable String id) {

        try {
            Oferente o = oferentes.findById(id).orElseThrow();
            o.setEstado((byte) 1);
            oferentes.save(o);

        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND
            );
        }
    }



}
