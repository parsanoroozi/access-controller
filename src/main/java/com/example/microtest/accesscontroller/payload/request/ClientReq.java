package com.example.microtest.accesscontroller.payload.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ClientReq {

    private Long id;

    private String name;

    private String secret;

    private Boolean hasPassiveAccessControl;

    private Long roleId;

}
