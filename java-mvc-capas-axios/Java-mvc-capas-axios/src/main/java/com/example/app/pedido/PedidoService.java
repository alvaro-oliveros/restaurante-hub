package com.example.app.pedido;

import com.example.app.cliente.Cliente;
import com.example.app.cliente.ClienteRepository;
import com.example.app.common.exception.ResourceNotFoundException;
import com.example.app.producto.Producto;
import com.example.app.producto.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final ProductoRepository productoRepository;
    private final DetallePedidoRepository detallePedidoRepository;

    // Obtener todos los pedidos
    public List<PedidoDTO> obtenerTodos() {
        return pedidoRepository.findAll()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // Obtener pedido por ID
    public PedidoDTO obtenerPorId(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado con id: " + id));
        return convertirADTO(pedido);
    }

    // Obtener pedidos por cliente
    public List<PedidoDTO> obtenerPorClienteId(Long clienteId) {
        return pedidoRepository.findByClienteIdOrderByFechaPedidoDesc(clienteId)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // Obtener pedidos por estado
    public List<PedidoDTO> obtenerPorEstado(Pedido.EstadoPedido estado) {
        return pedidoRepository.findByEstadoOrderByFechaPedidoAsc(estado)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // Crear pedido
    public PedidoDTO crear(PedidoDTO pedidoDTO) {
        Cliente cliente = clienteRepository.findById(pedidoDTO.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con id: " + pedidoDTO.getClienteId()));

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setTipo(pedidoDTO.getTipo());
        pedido.setEstado(Pedido.EstadoPedido.PENDIENTE);
        pedido.setFechaPedido(LocalDateTime.now());
        pedido.setObservaciones(pedidoDTO.getObservaciones());
        pedido.setDireccionEntrega(pedidoDTO.getDireccionEntrega());

        // Si hay mesaId en el DTO, buscar y asignar la mesa
        if (pedidoDTO.getMesaId() != null) {
            com.example.app.mesa.Mesa mesa = new com.example.app.mesa.Mesa();
            mesa.setId(pedidoDTO.getMesaId());
            pedido.setMesa(mesa);
        }

        // Calcular totales
        BigDecimal subtotal = BigDecimal.ZERO;

        // Guardar pedido primero para tener el ID
        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        // Crear detalles
        if (pedidoDTO.getDetalles() != null && !pedidoDTO.getDetalles().isEmpty()) {
            for (DetallePedidoDTO detalleDTO : pedidoDTO.getDetalles()) {
                Producto producto = productoRepository.findById(detalleDTO.getProductoId())
                        .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + detalleDTO.getProductoId()));

                DetallePedido detalle = new DetallePedido();
                detalle.setPedido(pedidoGuardado);
                detalle.setProducto(producto);
                detalle.setCantidad(detalleDTO.getCantidad());
                detalle.setPrecioUnitario(detalleDTO.getPrecioUnitario());
                detalle.setPersonalizacion(detalleDTO.getPersonalizacion());

                BigDecimal subtotalDetalle = detalleDTO.getPrecioUnitario()
                        .multiply(BigDecimal.valueOf(detalleDTO.getCantidad()));
                detalle.setSubtotal(subtotalDetalle);

                detallePedidoRepository.save(detalle);
                subtotal = subtotal.add(subtotalDetalle);
            }
        }

        // Calcular IGV (18%) y total
        BigDecimal igv = subtotal.multiply(BigDecimal.valueOf(0.18));
        BigDecimal total = subtotal.add(igv);

        pedidoGuardado.setSubtotal(subtotal);
        pedidoGuardado.setIgv(igv);
        pedidoGuardado.setTotal(total);

        Pedido pedidoFinal = pedidoRepository.save(pedidoGuardado);
        return convertirADTO(pedidoFinal);
    }

    // Actualizar estado del pedido
    public PedidoDTO actualizarEstado(Long id, Pedido.EstadoPedido nuevoEstado) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado con id: " + id));

        pedido.setEstado(nuevoEstado);
        Pedido pedidoActualizado = pedidoRepository.save(pedido);
        return convertirADTO(pedidoActualizado);
    }

    // Cancelar pedido
    public PedidoDTO cancelar(Long id) {
        return actualizarEstado(id, Pedido.EstadoPedido.CANCELADO);
    }

    // Obtener pedidos entre fechas (para reportes)
    public List<PedidoDTO> obtenerPorRangoFechas(LocalDateTime inicio, LocalDateTime fin) {
        return pedidoRepository.findByFechaPedidoBetween(inicio, fin)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // Métodos auxiliares de conversión
    private PedidoDTO convertirADTO(Pedido pedido) {
        PedidoDTO dto = new PedidoDTO();
        dto.setId(pedido.getId());
        dto.setFechaPedido(pedido.getFechaPedido());
        dto.setEstado(pedido.getEstado());
        dto.setTipo(pedido.getTipo());
        dto.setSubtotal(pedido.getSubtotal());
        dto.setIgv(pedido.getIgv());
        dto.setTotal(pedido.getTotal());
        dto.setObservaciones(pedido.getObservaciones());
        dto.setClienteId(pedido.getCliente().getId());
        dto.setDireccionEntrega(pedido.getDireccionEntrega());

        // Si hay mesa asignada, incluir su información
        if (pedido.getMesa() != null) {
            dto.setMesaId(pedido.getMesa().getId());
            dto.setNumeroMesa(pedido.getMesa().getNumeroMesa());
        }

        // Convertir detalles
        if (pedido.getDetalles() != null) {
            List<DetallePedidoDTO> detallesDTO = pedido.getDetalles().stream()
                    .map(this::convertirDetalleADTO)
                    .collect(Collectors.toList());
            dto.setDetalles(detallesDTO);
        }

        return dto;
    }

    private DetallePedidoDTO convertirDetalleADTO(DetallePedido detalle) {
        DetallePedidoDTO dto = new DetallePedidoDTO();
        dto.setId(detalle.getId());
        dto.setProductoId(detalle.getProducto().getId());
        dto.setNombreProducto(detalle.getProducto().getNombre());
        dto.setCantidad(detalle.getCantidad());
        dto.setPrecioUnitario(detalle.getPrecioUnitario());
        dto.setSubtotal(detalle.getSubtotal());
        dto.setPersonalizacion(detalle.getPersonalizacion());
        return dto;
    }
}
