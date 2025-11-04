package com.example.app.pedido;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PedidoController {

    private final PedidoService pedidoService;

    // GET - Obtener todos los pedidos
    @GetMapping
    public ResponseEntity<List<PedidoDTO>> obtenerTodos() {
        List<PedidoDTO> pedidos = pedidoService.obtenerTodos();
        return ResponseEntity.ok(pedidos);
    }

    // GET - Obtener pedido por ID
    @GetMapping("/{id}")
    public ResponseEntity<PedidoDTO> obtenerPorId(@PathVariable Long id) {
        PedidoDTO pedido = pedidoService.obtenerPorId(id);
        return ResponseEntity.ok(pedido);
    }

    // GET - Obtener pedidos por cliente
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<PedidoDTO>> obtenerPorClienteId(@PathVariable Long clienteId) {
        List<PedidoDTO> pedidos = pedidoService.obtenerPorClienteId(clienteId);
        return ResponseEntity.ok(pedidos);
    }

    // GET - Obtener pedidos por estado
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<PedidoDTO>> obtenerPorEstado(@PathVariable Pedido.EstadoPedido estado) {
        List<PedidoDTO> pedidos = pedidoService.obtenerPorEstado(estado);
        return ResponseEntity.ok(pedidos);
    }

    // POST - Crear nuevo pedido
    @PostMapping
    public ResponseEntity<PedidoDTO> crear(@Valid @RequestBody PedidoDTO pedidoDTO) {
        PedidoDTO nuevoPedido = pedidoService.crear(pedidoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPedido);
    }

    // PUT - Actualizar estado del pedido
    @PutMapping("/{id}/estado")
    public ResponseEntity<PedidoDTO> actualizarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Pedido.EstadoPedido nuevoEstado = Pedido.EstadoPedido.valueOf(body.get("estado"));
        PedidoDTO pedidoActualizado = pedidoService.actualizarEstado(id, nuevoEstado);
        return ResponseEntity.ok(pedidoActualizado);
    }

    // PUT - Cancelar pedido
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<PedidoDTO> cancelar(@PathVariable Long id) {
        PedidoDTO pedidoCancelado = pedidoService.cancelar(id);
        return ResponseEntity.ok(pedidoCancelado);
    }
}
