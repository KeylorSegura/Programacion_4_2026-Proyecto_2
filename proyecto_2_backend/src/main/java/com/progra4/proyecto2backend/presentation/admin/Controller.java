package com.progra4.proyecto2backend.presentation.admin;

import com.progra4.proyecto2backend.data.EmpresaRepository;
import com.progra4.proyecto2backend.data.CaracteristicaRepository;
import com.progra4.proyecto2backend.data.OferenteRepository;

import com.progra4.proyecto2backend.data.PuestoRepository;
import com.progra4.proyecto2backend.logic.Empresa;
import com.progra4.proyecto2backend.logic.Oferente;
import com.progra4.proyecto2backend.logic.Service;
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
    private Service service;

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

       return service.empresasPendientes();
    }

    @GetMapping("/oferentes-pendientes")
    public List<Oferente> oferentesPendientes() {

        return service.oferentesPendientes();
    }

    @PostMapping("/autorizarEmpresa/{id}")
    public void autorizarEmpresa(@PathVariable Integer id) {

        try {
            service.autorizarEmpresa(id);

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND
            );
        }
    }

    @PostMapping("/autorizarOferente/{id}")
    public void autorizarOferente(@PathVariable String id) {

        try {
            service.autorizarOferente(id);

        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND
            );
        }
    }



}
