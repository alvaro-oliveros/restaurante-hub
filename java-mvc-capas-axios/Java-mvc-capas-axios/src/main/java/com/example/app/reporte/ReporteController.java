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
@CrossOrigin(origins = "*")
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

    // GET - Obtener ventas por rango de fechas
    @GetMapping("/ventas/rango")
    public ResponseEntity<Map<String, Object>> obtenerVentasPorRango(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        Map<String, Object> ventas = reporteService.obtenerVentasPorRango(inicio, fin);
        return ResponseEntity.ok(ventas);
    }
}
