package com.example.app.reporte;

import com.example.app.cliente.MetodoPago;
import com.example.app.pedido.Pedido;
import com.example.app.pedido.PedidoRepository;
import com.example.app.producto.Producto;
import com.example.app.producto.ProductoRepository;
import com.example.app.cliente.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReporteService {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;
    private final ClienteRepository clienteRepository;

    private static final int DEFAULT_HEATMAP_DIAS = 30;

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

    public Map<String, Object> obtenerIngresosPorCanal() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        BigDecimal totalDelivery = BigDecimal.ZERO;
        BigDecimal totalPresencial = BigDecimal.ZERO;
        long pedidosDelivery = 0;
        long pedidosPresencial = 0;

        for (Pedido pedido : pedidos) {
            if (pedido.getEstado() == Pedido.EstadoPedido.CANCELADO) {
                continue;
            }
            if (pedido.getTipo() == Pedido.TipoPedido.DELIVERY) {
                totalDelivery = totalDelivery.add(Optional.ofNullable(pedido.getTotal()).orElse(BigDecimal.ZERO));
                pedidosDelivery++;
            } else {
                totalPresencial = totalPresencial.add(Optional.ofNullable(pedido.getTotal()).orElse(BigDecimal.ZERO));
                pedidosPresencial++;
            }
        }

        Map<String, Object> canales = new HashMap<>();

        canales.put("delivery", Map.of(
                "totalVentas", totalDelivery,
                "totalPedidos", pedidosDelivery
        ));
        canales.put("presencial", Map.of(
                "totalVentas", totalPresencial,
                "totalPedidos", pedidosPresencial
        ));

        return canales;
    }

    public Map<String, Object> obtenerVentasPorHora() {
        LocalDateTime inicioDia = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime finDia = LocalDateTime.now();

        List<Pedido> pedidosDelDia = pedidoRepository.findByFechaPedidoBetween(inicioDia, finDia);

        // Rango completo del día para no perder ventas por desfase horario
        int horaInicio = 0;
        int horaFin = 23;
        Map<Integer, BigDecimal> totalesHora = new LinkedHashMap<>();
        for (int hora = horaInicio; hora <= horaFin; hora++) {
            totalesHora.put(hora, BigDecimal.ZERO);
        }

        for (Pedido pedido : pedidosDelDia) {
            if (pedido.getEstado() == Pedido.EstadoPedido.CANCELADO) continue;
            LocalDateTime fechaPedido = pedido.getFechaPedido();
            if (fechaPedido == null) continue;
            int hora = fechaPedido.getHour();
            if (hora < horaInicio || hora > horaFin) continue;
            BigDecimal acumulado = totalesHora.get(hora);
            BigDecimal total = Optional.ofNullable(pedido.getTotal()).orElse(BigDecimal.ZERO);
            totalesHora.put(hora, acumulado.add(total));
        }

        List<Map<String, Object>> horas = totalesHora.entrySet().stream()
                .map(entry -> Map.<String, Object>of(
                        "hora", String.format("%02d:00", entry.getKey()),
                        "total", entry.getValue()
                ))
                .toList();

        return Map.of("horas", horas);
    }

    public Map<String, Object> obtenerPagosPorMetodo() {
        List<Pedido> pedidos = pedidoRepository.findAll();

        Map<MetodoPago.TipoPago, BigDecimal> totales = new EnumMap<>(MetodoPago.TipoPago.class);
        Map<MetodoPago.TipoPago, Long> conteos = new EnumMap<>(MetodoPago.TipoPago.class);
        for (MetodoPago.TipoPago tipo : MetodoPago.TipoPago.values()) {
            totales.put(tipo, BigDecimal.ZERO);
            conteos.put(tipo, 0L);
        }

        for (Pedido pedido : pedidos) {
            if (pedido.getEstado() == Pedido.EstadoPedido.CANCELADO) continue;
            MetodoPago.TipoPago medio = pedido.getMedioPago();
            if (medio == null) continue;
            BigDecimal acumulado = totales.getOrDefault(medio, BigDecimal.ZERO);
            BigDecimal total = Optional.ofNullable(pedido.getTotal()).orElse(BigDecimal.ZERO);
            totales.put(medio, acumulado.add(total));
            conteos.put(medio, conteos.getOrDefault(medio, 0L) + 1);
        }

        List<Map<String, Object>> breakdown = totales.entrySet().stream()
                .map(entry -> Map.<String, Object>of(
                        "medioPago", entry.getKey().name(),
                        "total", entry.getValue(),
                        "pedidos", conteos.getOrDefault(entry.getKey(), 0L)
                ))
                .toList();

        return Map.of("metodos", breakdown);
    }

    public Map<String, Object> obtenerProductosBajoStock() {
        List<Producto> productos = productoRepository.findTop5ByOrderByCantidadAsc();
        List<Map<String, Object>> items = productos.stream()
                .map(p -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", p.getId());
                    item.put("nombre", p.getNombre());
                    item.put("cantidad", p.getCantidad());
                    item.put("disponible", p.getDisponible());
                    item.put("disponibleDelivery", p.getDisponibleDelivery());
                    return item;
                })
                .toList();

        return Map.of("items", items);
    }

    public Map<String, Object> obtenerTendenciaVentas() {
        LocalDate hoy = LocalDate.now();
        LocalDate inicio = hoy.minusDays(6);
        LocalDateTime inicioDateTime = inicio.atStartOfDay();
        LocalDateTime finDateTime = hoy.atTime(23, 59, 59);

        List<Pedido> pedidos = pedidoRepository.findByFechaPedidoBetween(inicioDateTime, finDateTime);

        Map<LocalDate, BigDecimal> totales = new LinkedHashMap<>();
        for (int i = 0; i < 7; i++) {
            LocalDate dia = inicio.plusDays(i);
            totales.put(dia, BigDecimal.ZERO);
        }

        for (Pedido pedido : pedidos) {
            if (pedido.getEstado() == Pedido.EstadoPedido.CANCELADO) {
                continue;
            }
            LocalDate fecha = pedido.getFechaPedido().toLocalDate();
            if (totales.containsKey(fecha)) {
                BigDecimal acumulado = totales.get(fecha);
                BigDecimal total = Optional.ofNullable(pedido.getTotal()).orElse(BigDecimal.ZERO);
                totales.put(fecha, acumulado.add(total));
            }
        }

        List<Map<String, Object>> tendencia = totales.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> registro = new HashMap<>();
                    registro.put("fecha", entry.getKey());
                    registro.put("total", entry.getValue());
                    return registro;
                })
                .toList();

        return Map.of("tendencia", tendencia);
    }

    public Map<String, Object> obtenerClientesYZonas() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        Map<Long, Long> conteoClientes = new HashMap<>();
        Map<String, Long> conteoZonas = new HashMap<>();
        Map<Long, String> nombresClientes = new HashMap<>();

        for (Pedido pedido : pedidos) {
            if (pedido.getEstado() == Pedido.EstadoPedido.CANCELADO) {
                continue;
            }
            Long clienteId = pedido.getCliente().getId();
            conteoClientes.merge(clienteId, 1L, Long::sum);
            nombresClientes.putIfAbsent(clienteId,
                    pedido.getCliente().getNombre() + " " + pedido.getCliente().getApellido());

            if (pedido.getDireccionEntrega() != null && !pedido.getDireccionEntrega().isBlank()) {
                conteoZonas.merge(pedido.getDireccionEntrega(), 1L, Long::sum);
            }
        }

        List<Map<String, Object>> topClientes = conteoClientes.entrySet().stream()
                .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                .limit(5)
                .map(entry -> {
                    Map<String, Object> cliente = new HashMap<>();
                    cliente.put("clienteId", entry.getKey());
                    cliente.put("nombre", nombresClientes.get(entry.getKey()));
                    cliente.put("pedidos", entry.getValue());
                    return cliente;
                })
                .toList();

        List<Map<String, Object>> topZonas = conteoZonas.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(entry -> {
                    Map<String, Object> zona = new HashMap<>();
                    zona.put("direccion", entry.getKey());
                    zona.put("ordenes", entry.getValue());
                    return zona;
                })
                .toList();

        return Map.of("topClientes", topClientes, "topZonas", topZonas);
    }

    public Map<String, Object> obtenerHeatmapDelivery(LocalDateTime inicio, LocalDateTime fin) {
        LocalDateTime inicioUso = inicio != null ? inicio : LocalDateTime.now().minusDays(DEFAULT_HEATMAP_DIAS);
        LocalDateTime finUso = fin != null ? fin : LocalDateTime.now();

        List<Pedido> pedidos = pedidoRepository.findByFechaPedidoBetween(inicioUso, finUso);

        Map<String, Long> conteo = new HashMap<>();
        for (Pedido pedido : pedidos) {
            if (pedido.getTipo() != Pedido.TipoPedido.DELIVERY) continue;
            if (pedido.getEstado() == Pedido.EstadoPedido.CANCELADO) continue;

            String distrito = null;
            if (pedido.getCliente() != null) {
                distrito = pedido.getCliente().getDistrito();
            }
            if ((distrito == null || distrito.isBlank()) && pedido.getDireccionEntrega() != null) {
                distrito = pedido.getDireccionEntrega();
            }

            if (distrito != null && !distrito.isBlank()) {
                conteo.merge(distrito.trim(), 1L, Long::sum);
            }
        }

        List<Map<String, Object>> zonas = conteo.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(entry -> Map.<String, Object>of(
                        "distrito", entry.getKey(),
                        "total", entry.getValue()
                ))
                .toList();

        return Map.of(
                "inicio", inicioUso,
                "fin", finUso,
                "puntos", zonas
        );
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
