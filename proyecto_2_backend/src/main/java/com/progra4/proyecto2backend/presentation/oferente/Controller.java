package com.progra4.proyecto2backend.presentation.oferente;



import com.progra4.proyecto2backend.logic.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController("oferente")
@RequestMapping("/api/oferente")
@CrossOrigin(origins = "*")
public class Controller {

    @Autowired
    private Service service;



    @GetMapping("/habilidades/{usuarioId}")
    public List<Map<String, Object>> readHabilidades(@PathVariable String usuarioId) {
        return service.readHabilidades(usuarioId);
    }


    @GetMapping("/habilidades/subcategorias/{padreId}")
    public List<Map<String, Object>> readSubcategorias(@PathVariable Integer padreId) {
        return service.readSubcategorias(padreId);
    }

    @GetMapping("/habilidades/ruta/{padreId}")
    public List<Map<String, Object>> readRuta(@PathVariable Integer padreId) {
        return service.readRuta(padreId);
    }


    @PostMapping("/habilidades/agregar/{usuarioId}")
    public void agregarHabilidad(
            @PathVariable String usuarioId,
            @RequestBody Map<String, String> body) {

        service.agregarHabilidad(usuarioId, Integer.valueOf(body.get("caracteristicaId")), Integer.valueOf(body.get("nivel")));
    }


    @GetMapping("/cv/existe/{usuarioId}")
    public boolean existeCV(@PathVariable String usuarioId) {
        return service.existeCV(usuarioId);
    }



    @PostMapping("/cv/subir/{usuarioId}")
    public void subirCV(@PathVariable String usuarioId, @RequestParam("archivo") MultipartFile archivo) {

        service.subirCV(usuarioId, archivo);
    }


    @GetMapping("/cv/ver/{usuarioId}")
    public ResponseEntity<byte[]> verCV(@PathVariable String usuarioId) {
        byte[] pdf = service.obtenerCV(usuarioId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=cv.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}