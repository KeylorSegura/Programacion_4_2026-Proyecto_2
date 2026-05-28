package com.progra4.proyecto2backend.presentation.oferente;

import com.progra4.proyecto2backend.data.CaracteristicaRepository;
import com.progra4.proyecto2backend.data.OferentecaracteristicaRepository;
import com.progra4.proyecto2backend.data.OferenteRepository;
import com.progra4.proyecto2backend.data.UsuarioRepository;

import com.progra4.proyecto2backend.logic.Caracteristica;
import com.progra4.proyecto2backend.logic.Oferentecaracteristica;
import com.progra4.proyecto2backend.logic.Oferente;
import com.progra4.proyecto2backend.logic.Usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController("oferente")
@RequestMapping("/api/oferente")
@CrossOrigin(origins = "*")
public class Controller {

    @Autowired
    private OferenteRepository oferentes;

    @Autowired
    private UsuarioRepository usuarios;

    @Autowired
    private CaracteristicaRepository caracteristicas;

    @Autowired
    private OferentecaracteristicaRepository oferenteCaracteristicas;




    @GetMapping("/habilidades/{usuarioId}")
    public List<Map<String, Object>> readHabilidades(@PathVariable String usuarioId) {
        Oferente oferente = oferentes.findByNombreUsuarioId(usuarioId);

        if (oferente == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        return oferente.getOferentecaracteristicas()
                .stream()
                .sorted((oc1, oc2) -> construirRutaCaracteristica(oc1.getCaracteristica()).compareTo(construirRutaCaracteristica(oc2.getCaracteristica())))
                .map(oc -> Map.<String, Object>of("ruta", construirRutaCaracteristica(oc.getCaracteristica()), "nivel", oc.getNivel()))
                .toList();
    }


    @GetMapping("/habilidades/subcategorias/{padreId}")
    public List<Map<String, Object>> readSubcategorias(@PathVariable Integer padreId) {

        return caracteristicas.findByPadreId(padreId)
                .stream()
                .map(c -> Map.<String, Object>of("id", c.getId(), "nombre", c.getNombre()))
                .toList();
    }

    @GetMapping("/habilidades/ruta/{padreId}")
    public List<Map<String, Object>> readRuta(@PathVariable Integer padreId) {
        List<Caracteristica> lista;
        if (padreId == 0) {
            lista = caracteristicas.findByPadreIsNull();
        }
        else {
            lista = caracteristicas.findByPadreId(padreId);
        }

        return lista.stream()
                .map(c -> Map.<String, Object>of("id", c.getId(), "nombre", c.getNombre()))
                .toList();
    }


    @PostMapping("/habilidades/agregar/{usuarioId}")
    public void agregarHabilidad(@PathVariable String usuarioId, @RequestBody Map<String, String> body) {

        Integer caracteristicaId = Integer.valueOf(body.get("caracteristicaId"));

        Integer nivel = Integer.valueOf(body.get("nivel"));

        Oferente oferente = oferentes.findByNombreUsuarioId(usuarioId);

        Caracteristica caracteristica = caracteristicas.findById(caracteristicaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        Oferentecaracteristica existente = oferenteCaracteristicas.findByOferenteAndCaracteristica(oferente, caracteristica);

        if (existente != null) {
            existente.setNivel(nivel);
            oferenteCaracteristicas.save(existente);
        }
        else {
            Oferentecaracteristica nueva = new Oferentecaracteristica();
            nueva.setOferente(oferente);
            nueva.setCaracteristica(caracteristica);
            nueva.setNivel(nivel);
            oferenteCaracteristicas.save(nueva);
        }
    }


    private String construirRutaCaracteristica(Caracteristica c) {
        if (c.getPadre() == null) {
            return c.getNombre();
        }
        return construirRutaCaracteristica(c.getPadre())
                + " / "
                + c.getNombre();
    }



    @GetMapping("/cv/existe/{usuarioId}")
    public boolean existeCV(@PathVariable String usuarioId) {

        Oferente oferente = oferentes.findByNombreUsuarioId(usuarioId);

        byte[] cv = oferente.getCurriculum();

        return cv != null && cv.length > 0;
    }



    @PostMapping("/cv/subir/{usuarioId}")
    public void subirCV(@PathVariable String usuarioId, @RequestParam("archivo") MultipartFile archivo) {
        try {

            Oferente oferente = oferentes.findByNombreUsuarioId(usuarioId);

//            if (!archivo.isEmpty()) {
//                oferente.setCurriculum(archivo.getBytes());
//                oferentes.save(oferente);
//            }
            oferente.setCurriculum(archivo.getBytes());
            oferentes.save(oferente);

        }
        catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


    @GetMapping("/cv/ver/{usuarioId}")
    public ResponseEntity<byte[]> verCV(@PathVariable String usuarioId) {

        Oferente oferente = oferentes.findByNombreUsuarioId(usuarioId);

        byte[] pdf = oferente.getCurriculum();

        if (pdf == null || pdf.length == 0) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND
            );
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=cv.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}