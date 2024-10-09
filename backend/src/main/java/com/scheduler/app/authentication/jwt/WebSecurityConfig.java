package com.scheduler.app.authentication.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.http.HttpServletResponse;

@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Qualifier("userDetailServiceImpl")
    @Autowired
    private UserDetailsService userDetailsService;


    @Bean(BeanIds.AUTHENTICATION_MANAGER)
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .cors()
                .and()
                .csrf()
                .disable()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                // handle unauthorized attempts
                .exceptionHandling()
                .authenticationEntryPoint((req, rsp, e)
                        -> rsp.sendError(HttpServletResponse.SC_UNAUTHORIZED, e.getMessage()))
                .and()
                .authorizeRequests()
                // allow POST requests
                // TODO Check these things and adapt them to your app
                .antMatchers("/",
                        "/favicon.ico",
                        "/**/*.png",
                        "/**/*.svg",
                        "/**/*.jpg",
                        "/**/*.html","/status**", "/topic", "/timetable-ws/**")
                .permitAll()
                .antMatchers("/timetable/authentication/login")
                .permitAll()
                .antMatchers("/timetable/authentication/signup")
                .permitAll()

                // any other requests must be authenticated
                .anyRequest()
                .authenticated();
        http.addFilterBefore(jwtFilter(), UsernamePasswordAuthenticationFilter.class);
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .userDetailsService(userDetailsService)
                .passwordEncoder(bCrypt());
    }

    @Bean
    public PasswordEncoder bCrypt() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthFilter jwtFilter() {
        return new JwtAuthFilter();
    }
}
