package com.example.app.reporte;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ReporteService reporteService;

    // GET - Obtener estadísticas generales
    @GetMapping("/estadisticas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticasGenerales() {
        Map<String, Object> estadisticas = reporteService.obtenerEstadisticasGenerales();
        return ResponseEntity.ok(estadisticas);
    }

    // GET - Obtener ventas del día
    @GetMapping("/ventas/dia")
    public ResponseEntity<Map<String, Object>> obtenerVentasDelDia() {
        Map<String, Object> ventas = reporteService.obtenerVentasDelDia();
        return ResponseEntity.ok(ventas);
    }

    // GET - Obtener ventas del mes
    @GetMapping("/ventas/mes")
    public ResponseEntity<Map<String, Object>> obtenerVentasDelMes() {
        Map<String, Object> ventas = reporteService.obtenerVentasDelMes();
        return ResponseEntity.ok(ventas);
    }

    @GetMapping("/canales")
    public ResponseEntity<Map<String, Object>> obtenerCanales() {
        Map<String, Object> canales = reporteService.obtenerIngresosPorCanal();
        return ResponseEntity.ok(canales);
    }

    @GetMapping("/ventas/horas")
    public ResponseEntity<Map<String, Object>> obtenerVentasPorHora() {
        Map<String, Object> horas = reporteService.obtenerVentasPorHora();
        return ResponseEntity.ok(horas);
    }

    @GetMapping("/pagos")
    public ResponseEntity<Map<String, Object>> obtenerPagosPorMetodo() {
        Map<String, Object> pagos = reporteService.obtenerPagosPorMetodo();
        return ResponseEntity.ok(pagos);
    }

    @GetMapping("/stock/bajo")
    public ResponseEntity<Map<String, Object>> obtenerStockBajo() {
        Map<String, Object> stock = reporteService.obtenerProductosBajoStock();
        return ResponseEntity.ok(stock);
    }

    @GetMapping("/ventas/tendencia")
    public ResponseEntity<Map<String, Object>> obtenerTendenciaVentas() {
        Map<String, Object> tendencia = reporteService.obtenerTendenciaVentas();
        return ResponseEntity.ok(tendencia);
    }

    @GetMapping("/clientes-zonas")
    public ResponseEntity<Map<String, Object>> obtenerClientesYZonas() {
        Map<String, Object> info = reporteService.obtenerClientesYZonas();
        return ResponseEntity.ok(info);
    }

    @GetMapping("/delivery/heatmap")
    public ResponseEntity<Map<String, Object>> obtenerHeatmapDelivery(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        Map<String, Object> data = reporteService.obtenerHeatmapDelivery(inicio, fin);
        return ResponseEntity.ok(data);
    }

    // GET - Obtener ventas por rango de fechas
    @GetMapping("/ventas/rango")
    public ResponseEntity<Map<String, Object>> obtenerVentasPorRango(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        Map<String, Object> ventas = reporteService.obtenerVentasPorRango(inicio, fin);
        return ResponseEntity.ok(ventas);
    }
}
