package com.example.microtest.accesscontroller.payload.response;

import com.example.microtest.accesscontroller.domain.Resource;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AuthenticationResponse {

    private Boolean authenticated;
    private String accessToken;
    private String refreshToken;
    private List<Resource> resources;
    private String description;

}
