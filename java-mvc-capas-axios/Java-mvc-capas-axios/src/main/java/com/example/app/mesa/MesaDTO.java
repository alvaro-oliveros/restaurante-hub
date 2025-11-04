package com.example.app.mesa;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MesaDTO {

    private Long id;

    @NotNull(message = "El número de mesa es obligatorio")
    @Min(value = 1, message = "El número de mesa debe ser mayor que 0")
    private Integer numeroMesa;

    @NotNull(message = "La capacidad es obligatoria")
    @Min(value = 1, message = "La capacidad debe ser al menos 1")
    @Max(value = 20, message = "La capacidad no puede exceder 20 personas")
    private Integer capacidad;

    @Size(max = 50, message = "La ubicación no puede exceder 50 caracteres")
    private String ubicacion;

    @NotNull(message = "El estado es obligatorio")
    private Mesa.EstadoMesa estado;

    private String codigoQR;
}
