package com.example.app.pedido;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoEstadoHistorialDTO {
    private Pedido.EstadoPedido estado;
    private LocalDateTime fechaCambio;
}
