package com.prigione.security;

import com.prigione.model.Cantante;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtConfig jwtConfig;
    private final SecretKey secretKey;

    public String generateToken(Cantante cantante) {
        return generateToken(cantante, false);
    }

    public String generateRefreshToken(Cantante cantante) {
        return generateToken(cantante, true);
    }

    private String generateToken(Cantante cantante, boolean isRefreshToken) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", cantante.getEmail());
        claims.put("nome", cantante.getNome());
        claims.put("cantanteId", cantante.getId());
        claims.put("tokenType", isRefreshToken ? "REFRESH" : "ACCESS");
        claims.put("tokenId", UUID.randomUUID().toString());
        
        long expiration = isRefreshToken ? 
            jwtConfig.getRefreshExpiration() : 
            jwtConfig.getExpiration();

        return createToken(claims, cantante.getEmail(), expiration);
    }

    private String createToken(Map<String, Object> claims, String subject, long expiration) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(secretKey)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractTokenType(String token) {
        return extractAllClaims(token).get("tokenType", String.class);
    }

    public String extractTokenId(String token) {
        return extractAllClaims(token).get("tokenId", String.class);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        final String tokenType = extractTokenType(token);
        
        return (username.equals(userDetails.getUsername()) && 
                !isTokenExpired(token) && 
                "ACCESS".equals(tokenType));
    }

    public Boolean validateRefreshToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        final String tokenType = extractTokenType(token);
        
        return (username.equals(userDetails.getUsername()) && 
                !isTokenExpired(token) && 
                "REFRESH".equals(tokenType));
    }
}