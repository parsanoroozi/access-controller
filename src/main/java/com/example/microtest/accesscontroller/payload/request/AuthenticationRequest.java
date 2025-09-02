package com.example.microtest.accesscontroller.payload.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthenticationRequest {

    private String clientSecret;
    private String username;
    private String password;

}
