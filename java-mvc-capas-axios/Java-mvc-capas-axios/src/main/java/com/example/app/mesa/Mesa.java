package com.example.app.mesa;

import com.example.app.pedido.Pedido;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "mesas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Mesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Integer numeroMesa;

    @Column(nullable = false)
    private Integer capacidad;

    @Column(length = 50)
    private String ubicacion; // "Ventana", "Terraza", "Bar", "Centro"

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EstadoMesa estado;

    @Column(length = 100)
    private String codigoQR; // Para el escaneo QR

    @OneToMany(mappedBy = "mesa", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Pedido> pedidos;

    public enum EstadoMesa {
        DISPONIBLE,
        OCUPADA,
        RESERVADA,
        LIMPIEZA
    }
}
