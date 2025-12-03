package com.example.app.common.security;

import com.example.app.cliente.Cliente;
import com.example.app.cliente.ClienteRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (clienteRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Cliente cliente = new Cliente();
        cliente.setNombre(request.getNombre());
        cliente.setApellido(request.getApellido());
        cliente.setEmail(request.getEmail());
        cliente.setTelefono(request.getTelefono());
        cliente.setDireccion(request.getDireccion());
        cliente.setDocumentoIdentidad(request.getDocumentoIdentidad());
        cliente.setTipoVia(request.getTipoVia());
        cliente.setNumero(request.getNumero());
        cliente.setDistrito(request.getDistrito());
        cliente.setCiudad(request.getCiudad());
        cliente.setCodigoPostal(request.getCodigoPostal());
        cliente.setReferencia(request.getReferencia());
        cliente.setPassword(passwordEncoder.encode(request.getPassword()));
        cliente.setActivo(true);
        Cliente guardado = clienteRepository.save(cliente);

        return buildAuthResponse(guardado);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        Cliente cliente = clienteRepository.findByEmail(request.getEmail())
                .orElse(null);
        if (cliente == null || !passwordEncoder.matches(request.getPassword(), cliente.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return buildAuthResponse(cliente);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        ResponseCookie clearCookie = ResponseCookie.from("access_token", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(0)
                .build();
        return ResponseEntity.noContent()
                .header("Set-Cookie", clearCookie.toString())
                .build();
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(@CookieValue(name = "access_token", required = false) String token) {
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            var claims = jwtUtil.parseToken(token);
            String email = claims.getSubject();
            Cliente cliente = clienteRepository.findByEmail(email).orElse(null);
            if (cliente == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            return ResponseEntity.ok(toAuthResponse(cliente));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    private ResponseEntity<AuthResponse> buildAuthResponse(Cliente cliente) {
        Map<String, Object> claims = Map.of("clienteId", cliente.getId());
        String token = jwtUtil.generateToken(cliente.getEmail(), claims);
        ResponseCookie cookie = ResponseCookie.from("access_token", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(Duration.ofMillis(jwtUtil.getExpirationMs()))
                .build();
        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(toAuthResponse(cliente));
    }

    private AuthResponse toAuthResponse(Cliente cliente) {
        AuthResponse response = new AuthResponse();
        response.setId(cliente.getId());
        response.setNombre(cliente.getNombre());
        response.setApellido(cliente.getApellido());
        response.setEmail(cliente.getEmail());
        response.setTelefono(cliente.getTelefono());
        response.setDireccion(cliente.getDireccion());
        response.setTipoVia(cliente.getTipoVia());
        response.setNumero(cliente.getNumero());
        response.setDistrito(cliente.getDistrito());
        response.setCiudad(cliente.getCiudad());
        response.setCodigoPostal(cliente.getCodigoPostal());
        response.setReferencia(cliente.getReferencia());
        return response;
    }

    @Data
    public static class RegisterRequest {
        @NotBlank
        private String nombre;
        @NotBlank
        private String apellido;
        @NotBlank
        @Email
        private String email;
        @NotBlank
        @Size(min = 6, max = 120)
        private String password;
        @NotBlank
        private String telefono;
        @NotBlank
        private String direccion;
        @Size(max = 50)
        private String tipoVia;
        @Size(max = 20)
        private String numero;
        @Size(max = 100)
        private String distrito;
        @Size(max = 100)
        private String ciudad;
        @Size(max = 20)
        private String codigoPostal;
        @Size(max = 500)
        private String referencia;
        @NotBlank
        @Size(max = 20)
        private String documentoIdentidad;
    }

    @Data
    public static class LoginRequest {
        @NotBlank
        @Email
        private String email;
        @NotBlank
        private String password;
    }

    @Data
    public static class AuthResponse {
        private Long id;
        private String nombre;
        private String apellido;
        private String email;
        private String telefono;
        private String direccion;
        private String tipoVia;
        private String numero;
        private String distrito;
        private String ciudad;
        private String codigoPostal;
        private String referencia;
    }
}
