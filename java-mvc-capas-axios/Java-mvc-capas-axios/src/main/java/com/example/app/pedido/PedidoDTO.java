package com.example.app.pedido;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.example.app.cliente.MetodoPago;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoDTO {

    private Long id;

    private LocalDateTime fechaPedido;

    private Pedido.EstadoPedido estado;

    @NotNull(message = "El tipo de pedido es obligatorio")
    private Pedido.TipoPedido tipo;

    private BigDecimal subtotal;

    private BigDecimal igv;

    @NotNull(message = "El total es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El total debe ser mayor que 0")
    private BigDecimal total;

    @Size(max = 1000, message = "Las observaciones no pueden exceder 1000 caracteres")
    private String observaciones;

    @NotNull(message = "El ID del cliente es obligatorio")
    private Long clienteId;

    @NotNull(message = "El método de pago es obligatorio")
    private MetodoPago.TipoPago medioPago;

    private List<DetallePedidoDTO> detalles;

    @Size(max = 200, message = "La dirección de entrega no puede exceder 200 caracteres")
    private String direccionEntrega;

    private Long mesaId;

    private Integer numeroMesa; // Para mostrar en el frontend

    private String tokenMesa; // Validación simple de QR

    private Long tomadoPorUsuarioId; // Para pedidos tomados por mozo
}
