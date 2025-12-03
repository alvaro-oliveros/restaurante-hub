package com.example.app.pedido;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByClienteIdOrderByFechaPedidoDesc(Long clienteId);
    List<Pedido> findByEstadoOrderByFechaPedidoAsc(Pedido.EstadoPedido estado);
    List<Pedido> findByFechaPedidoBetween(LocalDateTime inicio, LocalDateTime fin);

    @Query("SELECT p FROM Pedido p WHERE p.estado IN :estados ORDER BY p.fechaPedido DESC")
    List<Pedido> findByEstadoIn(List<Pedido.EstadoPedido> estados);

    boolean existsByMesa_IdAndEstadoIn(Long mesaId, List<Pedido.EstadoPedido> estados);
}
