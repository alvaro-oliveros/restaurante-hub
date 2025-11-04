package com.example.app.cliente;

import com.example.app.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MetodoPagoService {

    private final MetodoPagoRepository metodoPagoRepository;
    private final ClienteRepository clienteRepository;

    // Obtener métodos de pago de un cliente
    public List<MetodoPagoDTO> obtenerPorClienteId(Long clienteId) {
        return metodoPagoRepository.findByClienteId(clienteId)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // Obtener método de pago por ID
    public MetodoPagoDTO obtenerPorId(Long id) {
        MetodoPago metodoPago = metodoPagoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Método de pago no encontrado con id: " + id));
        return convertirADTO(metodoPago);
    }

    // Crear método de pago
    public MetodoPagoDTO crear(MetodoPagoDTO metodoPagoDTO) {
        Cliente cliente = clienteRepository.findById(metodoPagoDTO.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con id: " + metodoPagoDTO.getClienteId()));

        MetodoPago metodoPago = convertirAEntidad(metodoPagoDTO);
        metodoPago.setCliente(cliente);

        // Si es principal, desmarcar los demás
        if (metodoPago.getEsPrincipal() != null && metodoPago.getEsPrincipal()) {
            desmarcarMetodosPrincipales(cliente.getId());
        }

        MetodoPago metodoPagoGuardado = metodoPagoRepository.save(metodoPago);
        return convertirADTO(metodoPagoGuardado);
    }

    // Actualizar método de pago
    public MetodoPagoDTO actualizar(Long id, MetodoPagoDTO metodoPagoDTO) {
        MetodoPago metodoPago = metodoPagoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Método de pago no encontrado con id: " + id));

        metodoPago.setTipo(metodoPagoDTO.getTipo());
        metodoPago.setAlias(metodoPagoDTO.getAlias());
        metodoPago.setUltimosCuatroDigitos(metodoPagoDTO.getUltimosCuatroDigitos());
        metodoPago.setNombreTarjeta(metodoPagoDTO.getNombreTarjeta());
        metodoPago.setMesExpiracion(metodoPagoDTO.getMesExpiracion());

        // Si se marca como principal, desmarcar los demás
        if (metodoPagoDTO.getEsPrincipal() != null && metodoPagoDTO.getEsPrincipal()) {
            desmarcarMetodosPrincipales(metodoPago.getCliente().getId());
            metodoPago.setEsPrincipal(true);
        } else if (metodoPagoDTO.getEsPrincipal() != null) {
            metodoPago.setEsPrincipal(false);
        }

        MetodoPago metodoPagoActualizado = metodoPagoRepository.save(metodoPago);
        return convertirADTO(metodoPagoActualizado);
    }

    // Eliminar método de pago
    public void eliminar(Long id) {
        if (!metodoPagoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Método de pago no encontrado con id: " + id);
        }
        metodoPagoRepository.deleteById(id);
    }

    // Método auxiliar para desmarcar métodos de pago principales
    private void desmarcarMetodosPrincipales(Long clienteId) {
        List<MetodoPago> metodosPago = metodoPagoRepository.findByClienteId(clienteId);
        metodosPago.forEach(m -> m.setEsPrincipal(false));
        metodoPagoRepository.saveAll(metodosPago);
    }

    // Métodos auxiliares de conversión
    private MetodoPagoDTO convertirADTO(MetodoPago metodoPago) {
        return new MetodoPagoDTO(
                metodoPago.getId(),
                metodoPago.getTipo(),
                metodoPago.getAlias(),
                metodoPago.getUltimosCuatroDigitos(),
                metodoPago.getNombreTarjeta(),
                metodoPago.getMesExpiracion(),
                metodoPago.getEsPrincipal(),
                metodoPago.getCliente().getId()
        );
    }

    private MetodoPago convertirAEntidad(MetodoPagoDTO dto) {
        MetodoPago metodoPago = new MetodoPago();
        metodoPago.setId(dto.getId());
        metodoPago.setTipo(dto.getTipo());
        metodoPago.setAlias(dto.getAlias());
        metodoPago.setUltimosCuatroDigitos(dto.getUltimosCuatroDigitos());
        metodoPago.setNombreTarjeta(dto.getNombreTarjeta());
        metodoPago.setMesExpiracion(dto.getMesExpiracion());
        metodoPago.setEsPrincipal(dto.getEsPrincipal() != null ? dto.getEsPrincipal() : false);
        return metodoPago;
    }
}
