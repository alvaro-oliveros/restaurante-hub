package com.example.app.cliente;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MetodoPagoDTO {

    private Long id;

    @NotNull(message = "El tipo de pago es obligatorio")
    private MetodoPago.TipoPago tipo;

    @Size(max = 100, message = "El alias no puede exceder 100 caracteres")
    private String alias;

    @Size(min = 4, max = 4, message = "Deben ser exactamente 4 dígitos")
    private String ultimosCuatroDigitos;

    @Size(max = 50, message = "El nombre de la tarjeta no puede exceder 50 caracteres")
    private String nombreTarjeta;

    @Pattern(regexp = "^(0[1-9]|1[0-2])/[0-9]{2}$", message = "El formato debe ser MM/YY")
    private String mesExpiracion;

    private Boolean esPrincipal;

    private Long clienteId;
}
