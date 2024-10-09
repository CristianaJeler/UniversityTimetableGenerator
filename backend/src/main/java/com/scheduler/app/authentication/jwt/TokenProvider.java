package com.scheduler.app.authentication.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class TokenProvider {
    @Autowired
    JwtValues jwtValues;
    public String generateToken(Authentication authentication) {
        UserCredentials userPrincipal = (UserCredentials) authentication.getPrincipal();

        var now = new Date();
        var expiryDate = new Date(now.getTime() + jwtValues.getEXPIRATION());

        return Jwts.builder()
                .setSubject(String.valueOf(userPrincipal.getId()))
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, jwtValues.getSECRET())
                .compact();
    }


    public String extractID(String token) {
        var claims = Jwts.parser()
                .setSigningKey(jwtValues.getSECRET())
                .parseClaimsJws(token)
                .getBody();

        return String.valueOf(claims.getSubject());
    }

}
