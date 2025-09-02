package com.example.microtest.accesscontroller.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ClientRes {

    private Long id;
    private String name;
    private String secret;
    private Boolean hasPassiveAccessControl;
    
    private RoleRes role;
}
