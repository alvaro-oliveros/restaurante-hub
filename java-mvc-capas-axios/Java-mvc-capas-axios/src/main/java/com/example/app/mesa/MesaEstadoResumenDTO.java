package com.example.app.mesa;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MesaEstadoResumenDTO {
    private Integer totalMesas;
    private Integer disponibles;
    private Integer ocupadas;
    private Integer reservadas;
    private Integer enLimpieza;
}
