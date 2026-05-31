package com.progra4.proyecto2backend.presentation.security;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JOSEObjectType;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import com.progra4.proyecto2backend.logic.Usuario;

@Service
@AllArgsConstructor
public class TokenService {
    private final JwtConfig jwtConfig;
    public String generateToken(Usuario usuario) {
        // header + payload/claims + signature
        var header = new JWSHeader.Builder(jwtConfig.getAlgorithm()).type(JOSEObjectType.JWT).build();
        Instant now = Instant.now();
        var builder = new JWTClaimsSet.Builder().issuer("TotalSoft").issueTime(Date.from(now))
                .expirationTime(Date.from(now.plus(jwtConfig.getJwtExpiration(), ChronoUnit.MILLIS)));
        var scopes =  List.of(usuario.getRol());
        builder.claim("scope", scopes);
        builder.claim("id", usuario.getId());
        var claims = builder.build();
        var key = jwtConfig.getSecretKey();
        var jwt = new SignedJWT(header, claims);
        try { var signer = new MACSigner(key); jwt.sign(signer);
        } catch (JOSEException e) { throw new RuntimeException("Error generating JWT",e); }
        return jwt.serialize();
    }
}
