package com.example.microtest.accesscontroller.payload.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class RoleReq {

    private Long id;

    private String name;

    private String type;

    private List<Long> resourceIds;

}
