package com.example.microtest.accesscontroller.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AccountRes {

    private Long id;
    private String username;
    private String password;

    private ClientSummary client;

    private RoleRes role;
    
}
