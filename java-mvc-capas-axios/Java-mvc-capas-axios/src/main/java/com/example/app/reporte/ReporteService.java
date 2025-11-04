package com.example.app.reporte;

import com.example.app.pedido.Pedido;
import com.example.app.pedido.PedidoRepository;
import com.example.app.producto.ProductoRepository;
import com.example.app.cliente.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReporteService {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;
    private final ClienteRepository clienteRepository;

    // Obtener estadísticas generales
    public Map<String, Object> obtenerEstadisticasGenerales() {
        Map<String, Object> estadisticas = new HashMap<>();

        // Totales
        estadisticas.put("totalClientes", clienteRepository.count());
        estadisticas.put("totalProductos", productoRepository.count());
        estadisticas.put("totalPedidos", pedidoRepository.count());

        // Pedidos por estado
        estadisticas.put("pedidosPendientes",
            pedidoRepository.findByEstadoOrderByFechaPedidoAsc(Pedido.EstadoPedido.PENDIENTE).size());
        estadisticas.put("pedidosEnPreparacion",
            pedidoRepository.findByEstadoOrderByFechaPedidoAsc(Pedido.EstadoPedido.EN_PREPARACION).size());
        estadisticas.put("pedidosListos",
            pedidoRepository.findByEstadoOrderByFechaPedidoAsc(Pedido.EstadoPedido.LISTO).size());

        return estadisticas;
    }

    // Obtener ventas del día
    public Map<String, Object> obtenerVentasDelDia() {
        LocalDateTime inicioDia = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime finDia = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);

        List<Pedido> pedidosDelDia = pedidoRepository.findByFechaPedidoBetween(inicioDia, finDia);

        BigDecimal totalVentas = pedidosDelDia.stream()
                .filter(p -> p.getEstado() != Pedido.EstadoPedido.CANCELADO)
                .map(Pedido::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> ventas = new HashMap<>();
        ventas.put("fecha", LocalDateTime.now());
        ventas.put("totalPedidos", pedidosDelDia.size());
        ventas.put("totalVentas", totalVentas);
        ventas.put("pedidos", pedidosDelDia.stream()
                .map(p -> {
                    Map<String, Object> pedido = new HashMap<>();
                    pedido.put("id", p.getId());
                    pedido.put("fecha", p.getFechaPedido());
                    pedido.put("total", p.getTotal());
                    pedido.put("estado", p.getEstado());
                    pedido.put("tipo", p.getTipo());
                    return pedido;
                })
                .toList());

        return ventas;
    }

    // Obtener ventas del mes
    public Map<String, Object> obtenerVentasDelMes() {
        LocalDateTime inicioMes = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime finMes = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);

        List<Pedido> pedidosDelMes = pedidoRepository.findByFechaPedidoBetween(inicioMes, finMes);

        BigDecimal totalVentas = pedidosDelMes.stream()
                .filter(p -> p.getEstado() != Pedido.EstadoPedido.CANCELADO)
                .map(Pedido::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> ventas = new HashMap<>();
        ventas.put("mesAnio", inicioMes.getMonth() + " " + inicioMes.getYear());
        ventas.put("totalPedidos", pedidosDelMes.size());
        ventas.put("totalVentas", totalVentas);

        return ventas;
    }

    // Obtener ventas por rango de fechas
    public Map<String, Object> obtenerVentasPorRango(LocalDateTime inicio, LocalDateTime fin) {
        List<Pedido> pedidos = pedidoRepository.findByFechaPedidoBetween(inicio, fin);

        BigDecimal totalVentas = pedidos.stream()
                .filter(p -> p.getEstado() != Pedido.EstadoPedido.CANCELADO)
                .map(Pedido::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> ventas = new HashMap<>();
        ventas.put("fechaInicio", inicio);
        ventas.put("fechaFin", fin);
        ventas.put("totalPedidos", pedidos.size());
        ventas.put("totalVentas", totalVentas);

        return ventas;
    }
}
