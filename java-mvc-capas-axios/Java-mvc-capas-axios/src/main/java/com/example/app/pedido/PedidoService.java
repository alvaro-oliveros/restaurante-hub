package com.example.app.pedido;

import com.example.app.cliente.Cliente;
import com.example.app.cliente.ClienteRepository;
import com.example.app.cliente.MetodoPago;
import com.example.app.common.exception.ResourceNotFoundException;
import com.example.app.mesa.Mesa;
import com.example.app.mesa.MesaRepository;
import com.example.app.producto.Producto;
import com.example.app.producto.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
@Transactional
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final ProductoRepository productoRepository;
    private final DetallePedidoRepository detallePedidoRepository;
    private final MesaRepository mesaRepository;
    private final PedidoEstadoHistorialRepository pedidoEstadoHistorialRepository;

    // Obtener todos los pedidos
    public List<PedidoDTO> obtenerTodos() {
        return pedidoRepository.findAll()
                .stream()
                .sorted((a, b) -> {
                    LocalDateTime fa = a.getFechaPedido();
                    LocalDateTime fb = b.getFechaPedido();
                    if (fa != null && fb != null && !fa.equals(fb)) {
                        return fb.compareTo(fa); // más reciente primero
                    }
                    return b.getId().compareTo(a.getId());
                })
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
                .sorted((a, b) -> {
                    LocalDateTime fa = a.getFechaPedido();
                    LocalDateTime fb = b.getFechaPedido();
                    if (fa != null && fb != null && !fa.equals(fb)) {
                        return fb.compareTo(fa);
                    }
                    return b.getId().compareTo(a.getId());
                })
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
        if (pedidoDTO.getMedioPago() == null) {
            throw new IllegalArgumentException("El método de pago es obligatorio");
        }
        if (!medioPagoValido(pedidoDTO.getTipo(), pedidoDTO.getMedioPago())) {
            throw new IllegalArgumentException("Método de pago no válido para este tipo de pedido");
        }
        pedido.setMedioPago(pedidoDTO.getMedioPago());
        pedido.setTomadoPorUsuarioId(pedidoDTO.getTomadoPorUsuarioId());

        // Si es un pedido presencial, validar mesa y token (QR)
            if (pedidoDTO.getTipo() == Pedido.TipoPedido.PRESENCIAL) {
                if (pedidoDTO.getMesaId() == null) {
                    throw new IllegalArgumentException("La mesa es obligatoria para pedidos presenciales");
                }
                Mesa mesa = mesaRepository.findById(pedidoDTO.getMesaId())
                        .orElseThrow(() -> new ResourceNotFoundException("Mesa no encontrada con id: " + pedidoDTO.getMesaId()));

                boolean pedidoTomadoPorMozo = pedidoDTO.getTomadoPorUsuarioId() != null;
                if (!pedidoTomadoPorMozo) {
                    if (pedidoDTO.getTokenMesa() == null || pedidoDTO.getTokenMesa().isBlank()) {
                        throw new IllegalArgumentException("Token de mesa requerido para pedidos desde QR");
                    }
                    if (mesa.getCodigoQR() == null || mesa.getCodigoQR().isBlank()) {
                        mesa.setCodigoQR("QR-MESA-" + mesa.getNumeroMesa());
                        mesaRepository.save(mesa);
                    }
                    if (!pedidoDTO.getTokenMesa().equals(mesa.getCodigoQR())) {
                        throw new IllegalArgumentException("Token de mesa inválido");
                    }
                    // Permitimos nuevas rondas de pedido aunque la mesa esté ocupada o reservada;
                    // solo bloqueamos si está en limpieza.
                    if (mesa.getEstado() == Mesa.EstadoMesa.LIMPIEZA) {
                        throw new IllegalStateException("La mesa no está disponible para tomar pedidos");
                    }
                }

            pedido.setMesa(mesa);
        }

        // Construir detalles y totales (precios incluyen IGV)
        BigDecimal total = BigDecimal.ZERO;
        List<DetallePedido> detalles = new ArrayList<>();

        if (pedidoDTO.getDetalles() != null && !pedidoDTO.getDetalles().isEmpty()) {
            for (DetallePedidoDTO detalleDTO : pedidoDTO.getDetalles()) {
                Producto producto = productoRepository.findById(detalleDTO.getProductoId())
                        .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + detalleDTO.getProductoId()));

                // Validar stock disponible
                if (producto.getCantidad() == null || producto.getCantidad() < detalleDTO.getCantidad()) {
                    throw new IllegalStateException("Stock insuficiente para el producto: " + producto.getNombre());
                }

                DetallePedido detalle = new DetallePedido();
                detalle.setPedido(pedido);
                detalle.setProducto(producto);
                detalle.setCantidad(detalleDTO.getCantidad());
                detalle.setPrecioUnitario(detalleDTO.getPrecioUnitario());
                detalle.setPersonalizacion(detalleDTO.getPersonalizacion());

                BigDecimal subtotalDetalle = detalleDTO.getPrecioUnitario()
                        .multiply(BigDecimal.valueOf(detalleDTO.getCantidad()));
                detalle.setSubtotal(subtotalDetalle); // Incluye IGV

                total = total.add(subtotalDetalle);
                detalles.add(detalle);

                // Actualizar stock y métricas del producto
                int nuevoStock = producto.getCantidad() - detalleDTO.getCantidad();
                producto.setCantidad(nuevoStock);
                producto.setDisponible(nuevoStock > 0);
                producto.setVecesVendido(
                        producto.getVecesVendido() == null
                                ? detalleDTO.getCantidad()
                                : producto.getVecesVendido() + detalleDTO.getCantidad());
                productoRepository.save(producto);
            }
        }

        // Calcular IGV incluido en el precio (18% incluido)
        BigDecimal subtotal = total.divide(BigDecimal.valueOf(1.18), 2, RoundingMode.HALF_UP);
        BigDecimal igv = total.subtract(subtotal);

        pedido.setSubtotal(subtotal);
        pedido.setIgv(igv);
        pedido.setTotal(total);
        pedido.setDetalles(detalles);

        Pedido pedidoFinal = pedidoRepository.save(pedido);
        registrarCambioEstado(pedidoFinal, pedidoFinal.getEstado());

        // Marcar la mesa como ocupada si corresponde
        if (pedidoFinal.getMesa() != null) {
            Mesa mesa = mesaRepository.findById(pedidoFinal.getMesa().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Mesa no encontrada con id: " + pedidoFinal.getMesa().getId()));
            if (mesa.getEstado() != Mesa.EstadoMesa.OCUPADA) {
                mesa.setEstado(Mesa.EstadoMesa.OCUPADA);
                mesaRepository.save(mesa);
            }
        }

        return convertirADTO(pedidoFinal);
    }

    // Actualizar estado del pedido
    public PedidoDTO actualizarEstado(Long id, Pedido.EstadoPedido nuevoEstado) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado con id: " + id));

        Pedido.EstadoPedido estadoAnterior = pedido.getEstado();
        if (estadoAnterior == nuevoEstado) {
            return convertirADTO(pedido);
        }

        // Validar flujo según tipo
        if (!esTransicionValida(pedido.getTipo(), estadoAnterior, nuevoEstado)) {
            throw new IllegalStateException("Transición de estado no permitida para este tipo de pedido");
        }

        // Ajustar stock y métricas al cancelar o reactivar
        if (estadoAnterior != Pedido.EstadoPedido.CANCELADO && nuevoEstado == Pedido.EstadoPedido.CANCELADO) {
            // Cancelación: devolver stock y restar ventas
            if (pedido.getDetalles() != null) {
                pedido.getDetalles().forEach(detalle -> {
                    Producto producto = detalle.getProducto();
                    int cantidad = detalle.getCantidad() == null ? 0 : detalle.getCantidad();
                    producto.setCantidad((producto.getCantidad() == null ? 0 : producto.getCantidad()) + cantidad);
                    producto.setDisponible(producto.getCantidad() > 0);
                    int ventas = producto.getVecesVendido() == null ? 0 : producto.getVecesVendido();
                    producto.setVecesVendido(Math.max(0, ventas - cantidad));
                    productoRepository.save(producto);
                });
            }
            // Liberar mesa si es un pedido presencial cancelado
            if (pedido.getTipo() == Pedido.TipoPedido.PRESENCIAL && pedido.getMesa() != null) {
                Mesa mesa = pedido.getMesa();
                mesa.setEstado(Mesa.EstadoMesa.DISPONIBLE);
                mesaRepository.save(mesa);
            }
        } else if (estadoAnterior == Pedido.EstadoPedido.CANCELADO && nuevoEstado != Pedido.EstadoPedido.CANCELADO) {
            // Reactivar pedido cancelado: volver a descontar stock y sumar ventas
            if (pedido.getDetalles() != null) {
                pedido.getDetalles().forEach(detalle -> {
                    Producto producto = detalle.getProducto();
                    int cantidad = detalle.getCantidad();
                    if (producto.getCantidad() == null || producto.getCantidad() < cantidad) {
                        throw new IllegalStateException("Stock insuficiente para reactivar el pedido en el producto: " + producto.getNombre());
                    }
                    producto.setCantidad(producto.getCantidad() - cantidad);
                    producto.setDisponible(producto.getCantidad() > 0);
                    int ventas = producto.getVecesVendido() == null ? 0 : producto.getVecesVendido();
                    producto.setVecesVendido(ventas + cantidad);
                    productoRepository.save(producto);
                });
            }
            // Reactivar mesa ocupada si era presencial
            if (pedido.getTipo() == Pedido.TipoPedido.PRESENCIAL && pedido.getMesa() != null) {
                Mesa mesa = pedido.getMesa();
                mesa.setEstado(Mesa.EstadoMesa.OCUPADA);
                mesaRepository.save(mesa);
            }
        }

        pedido.setEstado(nuevoEstado);
        registrarCambioEstado(pedido, nuevoEstado);

        // Si es presencial y se marca PAGADO, liberar la mesa
        if (pedido.getTipo() == Pedido.TipoPedido.PRESENCIAL && nuevoEstado == Pedido.EstadoPedido.PAGADO) {
            if (pedido.getMesa() != null) {
                com.example.app.mesa.Mesa mesa = pedido.getMesa();
                mesa.setEstado(com.example.app.mesa.Mesa.EstadoMesa.DISPONIBLE);
                mesaRepository.save(mesa);
                pedido.setMesa(null);
            }
        }

        Pedido pedidoActualizado = pedidoRepository.save(pedido);
        return convertirADTO(pedidoActualizado);
    }

    private boolean esTransicionValida(Pedido.TipoPedido tipo, Pedido.EstadoPedido from, Pedido.EstadoPedido to) {
        if (from == to) return true;
        if (to == Pedido.EstadoPedido.CANCELADO) return true;

        // Reactivar desde cancelado: solo a pendiente
        if (from == Pedido.EstadoPedido.CANCELADO) {
            return to == Pedido.EstadoPedido.PENDIENTE;
        }

        if (tipo == Pedido.TipoPedido.PRESENCIAL) {
            if (from == Pedido.EstadoPedido.PENDIENTE && to == Pedido.EstadoPedido.CONFIRMADO) return true;
            if (from == Pedido.EstadoPedido.CONFIRMADO && to == Pedido.EstadoPedido.EN_PREPARACION) return true;
            if (from == Pedido.EstadoPedido.EN_PREPARACION && to == Pedido.EstadoPedido.LISTO) return true;
            if (from == Pedido.EstadoPedido.LISTO && to == Pedido.EstadoPedido.SERVIDO) return true;
            if (from == Pedido.EstadoPedido.SERVIDO && to == Pedido.EstadoPedido.PAGADO) return true;
            // Permitir marcar pagado directamente si está listo
            if (from == Pedido.EstadoPedido.LISTO && to == Pedido.EstadoPedido.PAGADO) return true;
            // Si ya estaba marcado como ENTREGADO (datos antiguos), permitir pasar a SERVIDO/PAGADO
            if (from == Pedido.EstadoPedido.ENTREGADO && (to == Pedido.EstadoPedido.SERVIDO || to == Pedido.EstadoPedido.PAGADO)) return true;
            return false;
        } else if (tipo == Pedido.TipoPedido.DELIVERY) { // DELIVERY
            if (from == Pedido.EstadoPedido.PENDIENTE && to == Pedido.EstadoPedido.EN_PREPARACION) return true;
            if (from == Pedido.EstadoPedido.EN_PREPARACION && to == Pedido.EstadoPedido.LISTO) return true;
            if (from == Pedido.EstadoPedido.LISTO && to == Pedido.EstadoPedido.RECOGIDO) return true;
            if (from == Pedido.EstadoPedido.RECOGIDO && to == Pedido.EstadoPedido.ENTREGADO) return true;
            return false;
        }
        return false;
    }

    private boolean medioPagoValido(Pedido.TipoPedido tipo, MetodoPago.TipoPago medioPago) {
        if (tipo == Pedido.TipoPedido.PRESENCIAL) {
            return medioPago == MetodoPago.TipoPago.EFECTIVO
                    || medioPago == MetodoPago.TipoPago.TARJETA_CREDITO
                    || medioPago == MetodoPago.TipoPago.TARJETA_DEBITO
                    || medioPago == MetodoPago.TipoPago.YAPE
                    || medioPago == MetodoPago.TipoPago.PLIN;
        }
        if (tipo == Pedido.TipoPedido.DELIVERY) {
            return medioPago == MetodoPago.TipoPago.TARJETA_CREDITO
                    || medioPago == MetodoPago.TipoPago.TARJETA_DEBITO
                    || medioPago == MetodoPago.TipoPago.YAPE
                    || medioPago == MetodoPago.TipoPago.PLIN;
        }
        return false;
    }

    // Cancelar pedido
    public PedidoDTO cancelar(Long id) {
        return actualizarEstado(id, Pedido.EstadoPedido.CANCELADO);
    }

    public List<PedidoEstadoHistorialDTO> obtenerHistorial(Long pedidoId) {
        if (!pedidoRepository.existsById(pedidoId)) {
            throw new ResourceNotFoundException("Pedido no encontrado con id: " + pedidoId);
        }
        return pedidoEstadoHistorialRepository.findByPedidoIdOrderByFechaCambioAsc(pedidoId)
                .stream()
                .map(h -> new PedidoEstadoHistorialDTO(h.getEstado(), h.getFechaCambio()))
                .collect(Collectors.toList());
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
        dto.setMedioPago(pedido.getMedioPago());
        dto.setClienteId(pedido.getCliente().getId());
        dto.setDireccionEntrega(pedido.getDireccionEntrega());
        dto.setTomadoPorUsuarioId(pedido.getTomadoPorUsuarioId());

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

    private void registrarCambioEstado(Pedido pedido, Pedido.EstadoPedido nuevoEstado) {
        PedidoEstadoHistorial historial = new PedidoEstadoHistorial();
        historial.setPedido(pedido);
        historial.setEstado(nuevoEstado);
        historial.setFechaCambio(LocalDateTime.now());
        pedidoEstadoHistorialRepository.save(historial);
    }
}
