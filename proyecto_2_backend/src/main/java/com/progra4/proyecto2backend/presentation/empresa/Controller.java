package com.progra4.proyecto2backend.presentation.empresa;

import com.progra4.proyecto2backend.data.EmpresaRepository;
import com.progra4.proyecto2backend.data.UsuarioRepository;

import com.progra4.proyecto2backend.logic.Caracteristica;
import com.progra4.proyecto2backend.logic.Empresa;
import com.progra4.proyecto2backend.logic.Puesto;
import com.progra4.proyecto2backend.logic.Service;
import com.progra4.proyecto2backend.logic.Usuario;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

import org.springframework.web.bind.annotation.*;

import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController("empresa")
@RequestMapping("/api/empresa")
@CrossOrigin(origins = "*")
public class Controller {
    @Autowired
    private Service service;

    @Autowired
    private EmpresaRepository empresas;

    @Autowired
    private UsuarioRepository usuarios;

    @GetMapping("/caracteristicas")
    public List<Caracteristica> Caracteristicas(){
        return service.findCaracteristicas();
    }

    @GetMapping("/caracteristicas-raiz")
    public List<Caracteristica> caracteristicasRaiz() {
        return service.getCaracteristicasRaiz();
    }

    @PostMapping("/crear/puesto")
    public void crearPuesto(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal Jwt jwt) {

        String usuarioId = jwt.getClaim("id");

        String descripcion = (String) body.get("descripcion");

        Float salario = body.get("salario") == null
                ? null
                : Float.valueOf(body.get("salario").toString());

        String tipoPublicacion = (String) body.get("tipoPublicacion");

        List<Map<String, Object>> seleccionadas =
                (List<Map<String, Object>>) body.get("caracteristicas");

        Map<Integer, Integer> niveles = new LinkedHashMap<>();

        if (seleccionadas != null) {
            for (Map<String, Object> caracteristica : seleccionadas) {
                Integer id = Integer.valueOf(caracteristica.get("caracteristicaId").toString());
                Integer nivel = Integer.valueOf(caracteristica.get("nivel").toString());
                niveles.put(id, nivel);
            }
        }

        try {
            service.crearPuesto(usuarioId, descripcion, salario, tipoPublicacion, niveles);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/puestos")
    public List<Puesto> misPuestos(@AuthenticationPrincipal Jwt jwt) {
        String usuarioId = jwt.getClaim("id");

        return service.getPuestosEmpresa(usuarioId);
    }

    @PostMapping("/puestos/{id}/activar")
    public void activarPuesto(@PathVariable Integer id, @AuthenticationPrincipal Jwt jwt) {
        String usuarioId = jwt.getClaim("id");

        service.activarPuesto(usuarioId, id);
    }

    @PostMapping("/puestos/{id}/desactivar")
    public void desactivarPuesto(@PathVariable Integer id, @AuthenticationPrincipal Jwt jwt) {
        String usuarioId = jwt.getClaim("id");

        service.desactivarPuesto(usuarioId, id);
    }

    @GetMapping("/puestos/{id}/candidatos")
    public Map<String, Object> candidatos(@PathVariable Integer id, @AuthenticationPrincipal Jwt jwt) {
        String usuarioId = jwt.getClaim("id");

        return service.getCandidatos(usuarioId, id);
    }

    @GetMapping("/candidatos/oferente")
    public Map<String, Object> detalleOferente(@RequestParam Integer id) {
        return service.getDetalleOferente(id);
    }

    @GetMapping("/candidatos/oferente/verCV")
    public ResponseEntity<byte[]> verCVOferente(@RequestParam Integer id) {
        byte[] pdf = service.getOferenteById(id).getCurriculum();

        if (pdf == null || pdf.length == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=cv.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}