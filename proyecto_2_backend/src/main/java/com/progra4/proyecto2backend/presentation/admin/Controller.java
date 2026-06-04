package com.progra4.proyecto2backend.presentation.admin;

import com.progra4.proyecto2backend.data.EmpresaRepository;
import com.progra4.proyecto2backend.data.CaracteristicaRepository;
import com.progra4.proyecto2backend.data.OferenteRepository;

import com.progra4.proyecto2backend.data.PuestoRepository;
import com.progra4.proyecto2backend.logic.Caracteristica;
import com.progra4.proyecto2backend.logic.Empresa;
import com.progra4.proyecto2backend.logic.Oferente;
import com.progra4.proyecto2backend.logic.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController("admin")
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class Controller {

    @Autowired
    private Service service;

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

    @GetMapping("/caracteristicas")
    public List<Caracteristica> Caracteristicas(){
        return service.findCaracteristicas();
    }

    @GetMapping("/caracteristicas-raiz")
    public List<Caracteristica> caracteristicasRaiz() {
        return service.getCaracteristicasRaiz();
    }

    @PostMapping("/caracteristicas")
    @ResponseStatus(HttpStatus.CREATED)
    public void crearCaracteristica(
            @RequestBody Map<String, Object> body) {

        String nombre = (String) body.get("nombre");

        Integer padreId = null;

        if (body.get("padreId") != null) {
            padreId = ((Number) body.get("padreId")).intValue();
        }

        service.crearCaracteristica(nombre, padreId);
    }



}
