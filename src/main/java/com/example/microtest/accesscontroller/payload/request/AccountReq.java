package com.example.microtest.accesscontroller.payload.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AccountReq {

    private Long id;

    private String username;

    private String password;

    private Long clientId;

    private Long roleId;

}
