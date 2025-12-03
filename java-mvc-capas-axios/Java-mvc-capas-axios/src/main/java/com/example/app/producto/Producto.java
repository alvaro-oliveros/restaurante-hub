package com.example.app.producto;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "productos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 500)
    private String descripcion;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(precision = 10, scale = 2)
    private BigDecimal precioDelivery;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id")
    private CategoriaProducto categoria;

    @Column(length = 500)
    private String imagenUrl;

    @Column(nullable = false)
    private Boolean disponible = true;

    @Column
    private Double rating; // 0.0 a 5.0

    @Column
    private Integer tiempoPreparacion; // en minutos

    @Column(length = 500)
    private String alergenos; // Lista separada por comas: "gluten,lactosa,frutos secos"

    @Column
    private Integer vecesVendido = 0; // Para estadísticas

    @Column
    private Boolean esPopular = false;

    @Column
    private Boolean esVegetariano = false;

    @Column(nullable = false)
    private Boolean disponibleDelivery = true;
}
