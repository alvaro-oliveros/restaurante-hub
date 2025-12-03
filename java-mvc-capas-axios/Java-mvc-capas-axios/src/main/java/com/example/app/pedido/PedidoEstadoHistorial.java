package com.example.app.pedido;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "pedido_estado_historial")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoEstadoHistorial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Pedido.EstadoPedido estado;

    @Column(nullable = false)
    private LocalDateTime fechaCambio;

    @PrePersist
    public void onCreate() {
        if (fechaCambio == null) {
            fechaCambio = LocalDateTime.now();
        }
    }
}
