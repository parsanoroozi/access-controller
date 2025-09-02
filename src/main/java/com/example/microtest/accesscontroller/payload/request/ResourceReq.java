package com.example.microtest.accesscontroller.payload.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ResourceReq {

    private Long id;

    private String name;

    private String type; // api-endpoint, web-page, web-page-component

    private String url;

    private String action;

    private Long clientId;

}
