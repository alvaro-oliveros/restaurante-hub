package com.example.app.cliente;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes/{clienteId}/metodos-pago")
@RequiredArgsConstructor
public class MetodoPagoController {

    private final MetodoPagoService metodoPagoService;

    // GET - Obtener métodos de pago de un cliente
    @GetMapping
    public ResponseEntity<List<MetodoPagoDTO>> obtenerPorClienteId(@PathVariable Long clienteId) {
        List<MetodoPagoDTO> metodosPago = metodoPagoService.obtenerPorClienteId(clienteId);
        return ResponseEntity.ok(metodosPago);
    }

    // GET - Obtener método de pago por ID
    @GetMapping("/{id}")
    public ResponseEntity<MetodoPagoDTO> obtenerPorId(@PathVariable Long id) {
        MetodoPagoDTO metodoPago = metodoPagoService.obtenerPorId(id);
        return ResponseEntity.ok(metodoPago);
    }

    // POST - Crear nuevo método de pago
    @PostMapping
    public ResponseEntity<MetodoPagoDTO> crear(
            @PathVariable Long clienteId,
            @Valid @RequestBody MetodoPagoDTO metodoPagoDTO) {
        metodoPagoDTO.setClienteId(clienteId);
        MetodoPagoDTO nuevoMetodoPago = metodoPagoService.crear(metodoPagoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoMetodoPago);
    }

    // PUT - Actualizar método de pago
    @PutMapping("/{id}")
    public ResponseEntity<MetodoPagoDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody MetodoPagoDTO metodoPagoDTO) {
        MetodoPagoDTO metodoPagoActualizado = metodoPagoService.actualizar(id, metodoPagoDTO);
        return ResponseEntity.ok(metodoPagoActualizado);
    }

    // DELETE - Eliminar método de pago
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        metodoPagoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
