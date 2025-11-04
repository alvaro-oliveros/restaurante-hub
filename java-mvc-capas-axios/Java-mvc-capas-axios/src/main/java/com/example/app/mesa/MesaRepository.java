package com.example.app.mesa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MesaRepository extends JpaRepository<Mesa, Long> {
    Optional<Mesa> findByNumeroMesa(Integer numeroMesa);
    List<Mesa> findByEstado(Mesa.EstadoMesa estado);
    List<Mesa> findByCapacidad(Integer capacidad);
    List<Mesa> findByUbicacion(String ubicacion);
}
