package com.example.app.mesa;

import com.example.app.common.exception.ResourceNotFoundException;
import com.example.app.pedido.Pedido;
import com.example.app.pedido.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MesaService {

    private final MesaRepository mesaRepository;
    private final PedidoRepository pedidoRepository;

    // Obtener todas las mesas
    public List<MesaDTO> obtenerTodas() {
        return mesaRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(
                        Mesa::getUltimaActualizacion,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // Obtener mesa por ID
    public MesaDTO obtenerPorId(Long id) {
        Mesa mesa = mesaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mesa no encontrada con id: " + id));
        return convertirADTO(mesa);
    }

    // Obtener mesas por estado
    public List<MesaDTO> obtenerPorEstado(Mesa.EstadoMesa estado) {
        return mesaRepository.findByEstado(estado)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // Obtener mesas por capacidad
    public List<MesaDTO> obtenerPorCapacidad(Integer capacidad) {
        return mesaRepository.findByCapacidad(capacidad)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // Crear mesa
    public MesaDTO crear(MesaDTO mesaDTO) {
        // Validar que no exista otra mesa con el mismo número
        if (mesaRepository.findByNumeroMesa(mesaDTO.getNumeroMesa()).isPresent()) {
            throw new IllegalArgumentException("Ya existe una mesa con el número: " + mesaDTO.getNumeroMesa());
        }

        Mesa mesa = convertirAEntidad(mesaDTO);
        mesa.setCodigoQR("QR-MESA-" + mesa.getNumeroMesa());
        mesa.setUltimaActualizacion(LocalDateTime.now());

        Mesa mesaGuardada = mesaRepository.save(mesa);
        return convertirADTO(mesaGuardada);
    }

    // Actualizar mesa
    public MesaDTO actualizar(Long id, MesaDTO mesaDTO) {
        Mesa mesa = mesaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mesa no encontrada con id: " + id));

        // Validar número de mesa si cambió
        if (!mesa.getNumeroMesa().equals(mesaDTO.getNumeroMesa()) &&
            mesaRepository.findByNumeroMesa(mesaDTO.getNumeroMesa()).isPresent()) {
            throw new IllegalArgumentException("Ya existe una mesa con el número: " + mesaDTO.getNumeroMesa());
        }

        mesa.setNumeroMesa(mesaDTO.getNumeroMesa());
        mesa.setCapacidad(mesaDTO.getCapacidad());
        mesa.setUbicacion(mesaDTO.getUbicacion());
        mesa.setEstado(mesaDTO.getEstado());
        mesa.setUltimaActualizacion(LocalDateTime.now());

        Mesa mesaActualizada = mesaRepository.save(mesa);
        return convertirADTO(mesaActualizada);
    }

    // Actualizar solo el estado de la mesa
    public MesaDTO actualizarEstado(Long id, Mesa.EstadoMesa nuevoEstado) {
        Mesa mesa = mesaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mesa no encontrada con id: " + id));

        mesa.setEstado(nuevoEstado);
        mesa.setUltimaActualizacion(LocalDateTime.now());
        Mesa mesaActualizada = mesaRepository.save(mesa);
        return convertirADTO(mesaActualizada);
    }

    // Eliminar mesa
    public void eliminar(Long id) {
        if (!mesaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Mesa no encontrada con id: " + id);
        }
        mesaRepository.deleteById(id);
    }

    // Obtener resumen de estados
    public MesaEstadoResumenDTO obtenerResumenEstados() {
        List<Mesa> mesas = mesaRepository.findAll();

        long disponibles = mesas.stream().filter(m -> m.getEstado() == Mesa.EstadoMesa.DISPONIBLE).count();
        long ocupadas = mesas.stream().filter(m -> m.getEstado() == Mesa.EstadoMesa.OCUPADA).count();
        long reservadas = mesas.stream().filter(m -> m.getEstado() == Mesa.EstadoMesa.RESERVADA).count();
        long limpieza = mesas.stream().filter(m -> m.getEstado() == Mesa.EstadoMesa.LIMPIEZA).count();

        return new MesaEstadoResumenDTO(
                mesas.size(),
                (int) disponibles,
                (int) ocupadas,
                (int) reservadas,
                (int) limpieza
        );
    }

    // Métodos auxiliares de conversión
    private MesaDTO convertirADTO(Mesa mesa) {
        boolean tienePedidoActivo = pedidoRepository.existsByMesa_IdAndEstadoIn(
                mesa.getId(),
                List.of(
                        Pedido.EstadoPedido.PENDIENTE,
                        Pedido.EstadoPedido.CONFIRMADO,
                        Pedido.EstadoPedido.EN_PREPARACION,
                        Pedido.EstadoPedido.LISTO,
                        Pedido.EstadoPedido.ENTREGADO
                )
        );

        return new MesaDTO(
                mesa.getId(),
                mesa.getNumeroMesa(),
                mesa.getCapacidad(),
                mesa.getUbicacion(),
                mesa.getEstado(),
                mesa.getCodigoQR(),
                tienePedidoActivo,
                mesa.getUltimaActualizacion()
        );
    }

    private Mesa convertirAEntidad(MesaDTO dto) {
        Mesa mesa = new Mesa();
        mesa.setId(dto.getId());
        mesa.setNumeroMesa(dto.getNumeroMesa());
        mesa.setCapacidad(dto.getCapacidad());
        mesa.setUbicacion(dto.getUbicacion());
        mesa.setEstado(dto.getEstado());
        mesa.setCodigoQR(dto.getCodigoQR());
        mesa.setUltimaActualizacion(dto.getUltimaActualizacion());
        return mesa;
    }
}
