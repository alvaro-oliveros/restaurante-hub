package com.example.app.producto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDTO {

    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String nombre;

    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    private String descripcion;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 0, message = "La cantidad no puede ser negativa")
    private Integer cantidad;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor que 0")
    private BigDecimal precio;

    @DecimalMin(value = "0.0", inclusive = false, message = "El precio de delivery debe ser mayor que 0")
    private BigDecimal precioDelivery;

    private String imagenUrl;

    private Double rating;

    private Integer tiempoPreparacion;

    private String alergenos;

    private Integer vecesVendido;

    private Boolean esPopular;

    private Boolean esVegetariano;

    private Boolean disponible;

    private Boolean disponibleDelivery;

    private Long categoriaId;

    private String categoriaNombre;
}
