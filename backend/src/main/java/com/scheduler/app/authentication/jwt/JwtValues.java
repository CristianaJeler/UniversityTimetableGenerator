package com.scheduler.app.authentication.jwt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtValues {
    @Value(value = "${app.jwtHeader}")
    String HEADER;

    @Value(value = "${app.jwtTokenType}")
    String TOKEN_TYPE;

    @Value(value = "${app.jwtSecret}")
    String SECRET;

    @Value(value = "${app.jwtExpirationTime}")
    long EXPIRATION;


    @Value(value = "${app.signinURL}")
    String SIGNIN_URL;

    public Long getEXPIRATION() {
        return EXPIRATION;
    }

    public void setEXPIRATION(Long EXPIRATION) {
        this.EXPIRATION = EXPIRATION;
    }

    public String getSIGNIN_URL() {
        return SIGNIN_URL;
    }

    public void setSIGNIN_URL(String SIGNIN_URL) {
        this.SIGNIN_URL = SIGNIN_URL;
    }

    public String getHEADER() {
        return HEADER;
    }

    public void setHEADER(String HEADER) {
        this.HEADER = HEADER;
    }

    public String getTOKEN_TYPE() {
        return TOKEN_TYPE;
    }

    public void setTOKEN_TYPE(String TOKEN_TYPE) {
        this.TOKEN_TYPE = TOKEN_TYPE;
    }

    public String getSECRET() {
        return SECRET;
    }

    public void setSECRET(String SECRET) {
        this.SECRET = SECRET;
    }
}
