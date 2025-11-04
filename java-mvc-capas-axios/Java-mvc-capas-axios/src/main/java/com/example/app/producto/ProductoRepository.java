package com.example.app.producto;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Métodos de búsqueda personalizados
    List<Producto> findByNombreContainingIgnoreCase(String nombre);

    List<Producto> findByCantidadGreaterThan(Integer cantidad);
}