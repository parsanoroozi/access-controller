package com.example.microtest.accesscontroller.payload.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthorizationRequest {

    private String clientSecret;
    private String accessToken;
    private String username;
    private String resourceName;


}
