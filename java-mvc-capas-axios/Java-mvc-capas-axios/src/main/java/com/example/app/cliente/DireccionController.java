package com.example.app.cliente;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes/{clienteId}/direcciones")
@RequiredArgsConstructor
public class DireccionController {

    private final DireccionService direccionService;

    // GET - Obtener direcciones de un cliente
    @GetMapping
    public ResponseEntity<List<DireccionDTO>> obtenerPorClienteId(@PathVariable Long clienteId) {
        List<DireccionDTO> direcciones = direccionService.obtenerPorClienteId(clienteId);
        return ResponseEntity.ok(direcciones);
    }

    // GET - Obtener dirección por ID
    @GetMapping("/{id}")
    public ResponseEntity<DireccionDTO> obtenerPorId(@PathVariable Long id) {
        DireccionDTO direccion = direccionService.obtenerPorId(id);
        return ResponseEntity.ok(direccion);
    }

    // POST - Crear nueva dirección
    @PostMapping
    public ResponseEntity<DireccionDTO> crear(
            @PathVariable Long clienteId,
            @Valid @RequestBody DireccionDTO direccionDTO) {
        direccionDTO.setClienteId(clienteId);
        DireccionDTO nuevaDireccion = direccionService.crear(direccionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaDireccion);
    }

    // PUT - Actualizar dirección
    @PutMapping("/{id}")
    public ResponseEntity<DireccionDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody DireccionDTO direccionDTO) {
        DireccionDTO direccionActualizada = direccionService.actualizar(id, direccionDTO);
        return ResponseEntity.ok(direccionActualizada);
    }

    // DELETE - Eliminar dirección
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        direccionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
