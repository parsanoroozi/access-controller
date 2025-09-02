package com.example.microtest.accesscontroller.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ResourceRes {

    private Long id;
    private String name;
    private String type;
    private String url;
    private String action;

    private ClientSummary client;

}


