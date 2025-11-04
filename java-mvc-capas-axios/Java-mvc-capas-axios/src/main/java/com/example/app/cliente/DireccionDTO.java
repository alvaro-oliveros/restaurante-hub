package com.example.app.cliente;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DireccionDTO {

    private Long id;

    @NotBlank(message = "El alias es obligatorio")
    @Size(min = 2, max = 100, message = "El alias debe tener entre 2 y 100 caracteres")
    private String alias;

    @NotBlank(message = "La dirección es obligatoria")
    @Size(min = 5, max = 200, message = "La dirección debe tener entre 5 y 200 caracteres")
    private String direccion;

    @Size(max = 100, message = "El distrito no puede exceder 100 caracteres")
    private String distrito;

    @Size(max = 100, message = "La ciudad no puede exceder 100 caracteres")
    private String ciudad;

    @Size(max = 20, message = "El código postal no puede exceder 20 caracteres")
    private String codigoPostal;

    @Size(max = 500, message = "La referencia no puede exceder 500 caracteres")
    private String referencia;

    private Boolean esPrincipal;

    @NotNull(message = "El ID del cliente es obligatorio")
    private Long clienteId;
}
