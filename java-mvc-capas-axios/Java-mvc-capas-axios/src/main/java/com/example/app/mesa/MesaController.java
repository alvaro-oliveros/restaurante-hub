package com.example.app.mesa;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mesas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MesaController {

    private final MesaService mesaService;

    // GET - Obtener todas las mesas
    @GetMapping
    public ResponseEntity<List<MesaDTO>> obtenerTodas() {
        List<MesaDTO> mesas = mesaService.obtenerTodas();
        return ResponseEntity.ok(mesas);
    }

    // GET - Obtener mesa por ID
    @GetMapping("/{id}")
    public ResponseEntity<MesaDTO> obtenerPorId(@PathVariable Long id) {
        MesaDTO mesa = mesaService.obtenerPorId(id);
        return ResponseEntity.ok(mesa);
    }

    // GET - Obtener mesas por estado
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<MesaDTO>> obtenerPorEstado(@PathVariable Mesa.EstadoMesa estado) {
        List<MesaDTO> mesas = mesaService.obtenerPorEstado(estado);
        return ResponseEntity.ok(mesas);
    }

    // GET - Obtener mesas por capacidad
    @GetMapping("/capacidad/{capacidad}")
    public ResponseEntity<List<MesaDTO>> obtenerPorCapacidad(@PathVariable Integer capacidad) {
        List<MesaDTO> mesas = mesaService.obtenerPorCapacidad(capacidad);
        return ResponseEntity.ok(mesas);
    }

    // GET - Obtener resumen de estados
    @GetMapping("/resumen-estados")
    public ResponseEntity<MesaEstadoResumenDTO> obtenerResumenEstados() {
        MesaEstadoResumenDTO resumen = mesaService.obtenerResumenEstados();
        return ResponseEntity.ok(resumen);
    }

    // POST - Crear nueva mesa
    @PostMapping
    public ResponseEntity<MesaDTO> crear(@Valid @RequestBody MesaDTO mesaDTO) {
        MesaDTO nuevaMesa = mesaService.crear(mesaDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaMesa);
    }

    // PUT - Actualizar mesa
    @PutMapping("/{id}")
    public ResponseEntity<MesaDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody MesaDTO mesaDTO) {
        MesaDTO mesaActualizada = mesaService.actualizar(id, mesaDTO);
        return ResponseEntity.ok(mesaActualizada);
    }

    // PATCH - Actualizar solo el estado
    @PatchMapping("/{id}/estado")
    public ResponseEntity<MesaDTO> actualizarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Mesa.EstadoMesa nuevoEstado = Mesa.EstadoMesa.valueOf(body.get("estado"));
        MesaDTO mesaActualizada = mesaService.actualizarEstado(id, nuevoEstado);
        return ResponseEntity.ok(mesaActualizada);
    }

    // DELETE - Eliminar mesa
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        mesaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
