package com.example.app.cliente;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    // GET - Obtener todos los clientes
    @GetMapping
    public ResponseEntity<List<ClienteDTO>> obtenerTodos() {
        List<ClienteDTO> clientes = clienteService.obtenerTodos();
        return ResponseEntity.ok(clientes);
    }

    // GET - Obtener cliente por ID
    @GetMapping("/{id}")
    public ResponseEntity<ClienteDTO> obtenerPorId(@PathVariable Long id) {
        ClienteDTO cliente = clienteService.obtenerPorId(id);
        return ResponseEntity.ok(cliente);
    }

    // POST - Crear nuevo cliente
    @PostMapping
    public ResponseEntity<ClienteDTO> crear(@Valid @RequestBody ClienteDTO clienteDTO) {
        ClienteDTO nuevoCliente = clienteService.crear(clienteDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoCliente);
    }

    // PUT - Actualizar cliente
    @PutMapping("/{id}")
    public ResponseEntity<ClienteDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ClienteDTO clienteDTO) {
        ClienteDTO clienteActualizado = clienteService.actualizar(id, clienteDTO);
        return ResponseEntity.ok(clienteActualizado);
    }

    // DELETE - Eliminar cliente
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        clienteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // GET - Buscar por email
    @GetMapping("/email")
    public ResponseEntity<ClienteDTO> buscarPorEmail(@RequestParam String email) {
        ClienteDTO cliente = clienteService.buscarPorEmail(email);
        return ResponseEntity.ok(cliente);
    }
}
