package com.example.microtest.accesscontroller.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class RoleRes {

    private Long id;
    private String name;
    private String type;

    private List<ResourceRes> resources;

}
