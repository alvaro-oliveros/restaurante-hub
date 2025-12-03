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
public class DireccionService {

    private final DireccionRepository direccionRepository;
    private final ClienteRepository clienteRepository;

    // Obtener direcciones de un cliente
    public List<DireccionDTO> obtenerPorClienteId(Long clienteId) {
        List<Direccion> direcciones = direccionRepository.findByClienteId(clienteId);

        // Si no hay direcciones pero el cliente tiene datos de dirección, crear una principal
        if (direcciones.isEmpty()) {
            clienteRepository.findById(clienteId).ifPresent(cliente -> {
                if (cliente.getDireccion() != null && !cliente.getDireccion().isBlank()) {
                    Direccion direccion = new Direccion();
                    direccion.setAlias("Principal");
                    direccion.setDireccion(cliente.getDireccion());
                    direccion.setDistrito(cliente.getDistrito());
                    direccion.setCiudad(cliente.getCiudad());
                    direccion.setCodigoPostal(cliente.getCodigoPostal());
                    direccion.setReferencia(cliente.getReferencia());
                    direccion.setEsPrincipal(true);
                    direccion.setCliente(cliente);
                    direccionRepository.save(direccion);
                }
            });
            direcciones = direccionRepository.findByClienteId(clienteId);
        }

        return direcciones.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // Obtener dirección por ID
    public DireccionDTO obtenerPorId(Long id) {
        Direccion direccion = direccionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dirección no encontrada con id: " + id));
        return convertirADTO(direccion);
    }

    // Crear dirección
    public DireccionDTO crear(DireccionDTO direccionDTO) {
        Cliente cliente = clienteRepository.findById(direccionDTO.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con id: " + direccionDTO.getClienteId()));

        Direccion direccion = convertirAEntidad(direccionDTO);
        direccion.setCliente(cliente);

        // Si es principal, desmarcar las demás
        if (direccion.getEsPrincipal() != null && direccion.getEsPrincipal()) {
            desmarcarDireccionesPrincipales(cliente.getId());
        }

        Direccion direccionGuardada = direccionRepository.save(direccion);
        return convertirADTO(direccionGuardada);
    }

    // Actualizar dirección
    public DireccionDTO actualizar(Long id, DireccionDTO direccionDTO) {
        Direccion direccion = direccionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dirección no encontrada con id: " + id));

        direccion.setAlias(direccionDTO.getAlias());
        direccion.setDireccion(direccionDTO.getDireccion());
        direccion.setDistrito(direccionDTO.getDistrito());
        direccion.setCiudad(direccionDTO.getCiudad());
        direccion.setCodigoPostal(direccionDTO.getCodigoPostal());
        direccion.setReferencia(direccionDTO.getReferencia());

        // Si se marca como principal, desmarcar las demás
        if (direccionDTO.getEsPrincipal() != null && direccionDTO.getEsPrincipal()) {
            desmarcarDireccionesPrincipales(direccion.getCliente().getId());
            direccion.setEsPrincipal(true);
        } else if (direccionDTO.getEsPrincipal() != null) {
            direccion.setEsPrincipal(false);
        }

        Direccion direccionActualizada = direccionRepository.save(direccion);
        return convertirADTO(direccionActualizada);
    }

    // Eliminar dirección
    public void eliminar(Long id) {
        if (!direccionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Dirección no encontrada con id: " + id);
        }
        direccionRepository.deleteById(id);
    }

    // Método auxiliar para desmarcar direcciones principales
    private void desmarcarDireccionesPrincipales(Long clienteId) {
        List<Direccion> direcciones = direccionRepository.findByClienteId(clienteId);
        direcciones.forEach(d -> d.setEsPrincipal(false));
        direccionRepository.saveAll(direcciones);
    }

    // Métodos auxiliares de conversión
    private DireccionDTO convertirADTO(Direccion direccion) {
        return new DireccionDTO(
                direccion.getId(),
                direccion.getAlias(),
                direccion.getDireccion(),
                direccion.getDistrito(),
                direccion.getCiudad(),
                direccion.getCodigoPostal(),
                direccion.getReferencia(),
                direccion.getEsPrincipal(),
                direccion.getCliente().getId()
        );
    }

    private Direccion convertirAEntidad(DireccionDTO dto) {
        Direccion direccion = new Direccion();
        direccion.setId(dto.getId());
        direccion.setAlias(dto.getAlias());
        direccion.setDireccion(dto.getDireccion());
        direccion.setDistrito(dto.getDistrito());
        direccion.setCiudad(dto.getCiudad());
        direccion.setCodigoPostal(dto.getCodigoPostal());
        direccion.setReferencia(dto.getReferencia());
        direccion.setEsPrincipal(dto.getEsPrincipal() != null ? dto.getEsPrincipal() : false);
        return direccion;
    }
}
