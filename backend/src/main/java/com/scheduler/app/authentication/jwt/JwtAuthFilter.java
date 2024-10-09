package com.scheduler.app.authentication.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtAuthFilter extends OncePerRequestFilter {
    @Autowired
    JwtValues jwtValues;

    @Autowired
    private UserDetailServiceImpl userDetailsService;

    @Autowired
    TokenProvider tokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        try {
            String token;
            String header = request.getHeader(jwtValues.getHEADER());
            if (StringUtils.hasText(header) && header.startsWith(jwtValues.getTOKEN_TYPE()+" ")) {
                token = header.replace(jwtValues.getTOKEN_TYPE()+" ", "");
            } else token = null;


            if (StringUtils.hasText(token)) {
                String userId = tokenProvider.extractID(token);
                UserDetails userDetails = userDetailsService.getUserByID(userId);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {

        }
        chain.doFilter(request, response);
    }
}
