package com.example.app.producto;

import com.example.app.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductoService {

    private final ProductoRepository productoRepository;

    // Obtener todos los productos
    public List<ProductoDTO> obtenerTodos() {
        return productoRepository.findAll()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public List<ProductoDTO> obtenerDisponiblesDelivery() {
        return productoRepository.findByDisponibleDeliveryTrue()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public List<ProductoDTO> obtenerDisponiblesLocal() {
        return productoRepository.findByDisponibleTrue()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // Obtener producto por ID
    public ProductoDTO obtenerPorId(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + id));
        return convertirADTO(producto);
    }

    // Crear producto
    public ProductoDTO crear(ProductoDTO productoDTO) {
        Producto producto = convertirAEntidad(productoDTO);
        Producto productoGuardado = productoRepository.save(producto);
        return convertirADTO(productoGuardado);
    }

    // Actualizar producto
    public ProductoDTO actualizar(Long id, ProductoDTO productoDTO) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + id));

        producto.setNombre(productoDTO.getNombre());
        producto.setDescripcion(productoDTO.getDescripcion());
        producto.setCantidad(productoDTO.getCantidad());
        producto.setPrecio(productoDTO.getPrecio());
        producto.setPrecioDelivery(productoDTO.getPrecioDelivery());
        producto.setImagenUrl(productoDTO.getImagenUrl());
        producto.setRating(productoDTO.getRating());
        producto.setTiempoPreparacion(productoDTO.getTiempoPreparacion());
        producto.setAlergenos(productoDTO.getAlergenos());
        producto.setVecesVendido(productoDTO.getVecesVendido());
        producto.setEsPopular(productoDTO.getEsPopular());
        producto.setEsVegetariano(productoDTO.getEsVegetariano());
        producto.setDisponible(productoDTO.getDisponible());
        producto.setDisponibleDelivery(productoDTO.getDisponibleDelivery());
        if (productoDTO.getCategoriaId() != null) {
            CategoriaProducto categoria = new CategoriaProducto();
            categoria.setId(productoDTO.getCategoriaId());
            producto.setCategoria(categoria);
        } else {
            producto.setCategoria(null);
        }

        Producto productoActualizado = productoRepository.save(producto);
        return convertirADTO(productoActualizado);
    }

    // Eliminar producto
    public void eliminar(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Producto no encontrado con id: " + id);
        }
        productoRepository.deleteById(id);
    }

    // Buscar por nombre
    public List<ProductoDTO> buscarPorNombre(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCase(nombre)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // Métodos auxiliares de conversión
    private ProductoDTO convertirADTO(Producto producto) {
        ProductoDTO dto = new ProductoDTO();
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setDescripcion(producto.getDescripcion());
        dto.setCantidad(producto.getCantidad());
        dto.setPrecio(producto.getPrecio());
        dto.setPrecioDelivery(producto.getPrecioDelivery());
        dto.setImagenUrl(producto.getImagenUrl());
        dto.setRating(producto.getRating());
        dto.setTiempoPreparacion(producto.getTiempoPreparacion());
        dto.setAlergenos(producto.getAlergenos());
        dto.setVecesVendido(producto.getVecesVendido());
        dto.setEsPopular(producto.getEsPopular());
        dto.setEsVegetariano(producto.getEsVegetariano());
        dto.setDisponible(producto.getDisponible());
        dto.setDisponibleDelivery(producto.getDisponibleDelivery());

        if (producto.getCategoria() != null) {
            dto.setCategoriaId(producto.getCategoria().getId());
            dto.setCategoriaNombre(producto.getCategoria().getNombre());
        }

        return dto;
    }

    private Producto convertirAEntidad(ProductoDTO dto) {
        Producto producto = new Producto();
        producto.setId(dto.getId());
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setCantidad(dto.getCantidad());
        producto.setPrecio(dto.getPrecio());
        producto.setPrecioDelivery(dto.getPrecioDelivery());
        producto.setImagenUrl(dto.getImagenUrl());
        producto.setRating(dto.getRating());
        producto.setTiempoPreparacion(dto.getTiempoPreparacion());
        producto.setAlergenos(dto.getAlergenos());
        producto.setVecesVendido(dto.getVecesVendido());
        producto.setEsPopular(dto.getEsPopular());
        producto.setEsVegetariano(dto.getEsVegetariano());
        producto.setDisponible(dto.getDisponible());
        producto.setDisponibleDelivery(dto.getDisponibleDelivery());

        if (dto.getCategoriaId() != null) {
            CategoriaProducto categoria = new CategoriaProducto();
            categoria.setId(dto.getCategoriaId());
            producto.setCategoria(categoria);
        }

        return producto;
    }
}
