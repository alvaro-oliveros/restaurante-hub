package com.example.app.cliente;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "metodos_pago")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MetodoPago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private TipoPago tipo; // TARJETA_CREDITO, TARJETA_DEBITO, YAPE, EFECTIVO

    @Column(length = 100)
    private String alias; // "Visa Personal", "Mastercard Trabajo", etc.

    @Column(length = 4)
    private String ultimosCuatroDigitos; // Solo para tarjetas

    @Column(length = 50)
    private String nombreTarjeta; // Nombre del titular

    @Column(length = 10)
    private String mesExpiracion; // MM/YY

    @Column(nullable = false)
    private Boolean esPrincipal = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    @JsonIgnore
    private Cliente cliente;

    public enum TipoPago {
        TARJETA_CREDITO,
        TARJETA_DEBITO,
        YAPE,
        PLIN,
        EFECTIVO
    }
}
