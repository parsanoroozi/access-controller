package com.example.microtest.accesscontroller.payload.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthorizationResponse {

    private Boolean authenticated;
    private Boolean allowed;
    private String accessToken;
    private String refreshToken;
    private String description;
}
