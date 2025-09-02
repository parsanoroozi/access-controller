package com.example.microtest.accesscontroller.config;

import com.example.microtest.accesscontroller.domain.Client;
import com.example.microtest.accesscontroller.payload.request.ClientReq;
import com.example.microtest.accesscontroller.payload.request.ResourceReq;
import com.example.microtest.accesscontroller.payload.request.RoleReq;
import com.example.microtest.accesscontroller.service.AccountService;
import com.example.microtest.accesscontroller.service.ClientService;
import com.example.microtest.accesscontroller.service.ResourceService;
import com.example.microtest.accesscontroller.service.RoleService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@RequiredArgsConstructor
@Configuration
@Slf4j
public class DataFiller {

    private final ClientService clientService;
    private final ResourceService resourceService;
    private final RoleService roleService;
    private final AccountService accountService;


    @PostConstruct
    public void fillData(){


        ClientReq clientReq1 = ClientReq.builder()
                .name("Application1")
                .secret("secret1")
                .hasPassiveAccessControl(true)
                .build();

        log.info("creating client 1 {}",  clientReq1);

        clientService.create(clientReq1);


        ResourceReq resourceReq1 = ResourceReq.builder()
                .name("resource1")
                .type("Web Page")
                .action("READ")
                .url("/dashboard/admins")
                .clientId(1L)
                .build();
        log.info("creating resource 1 {}",  resourceReq1);
        resourceService.create(resourceReq1);

        ResourceReq resourceReq2 = ResourceReq.builder()
                .name("resource2")
                .type("API Endpoint")
                .action("GET")
                .url("/api/v1/admins")
                .clientId(1L)
                .build();
        log.info("creating resource 2 {}",  resourceReq2);
        resourceService.create(resourceReq2);

        ResourceReq resourceReq3 = ResourceReq.builder()
                .name("resource3")
                .type("API Endpoint")
                .action("POST")
                .url("/api/v1/admins/update")
                .clientId(1L)
                .build();
        log.info("creating resource 3 {}",  resourceReq3);
        resourceService.create(resourceReq3);


        RoleReq roleReq1 = RoleReq.builder()
                .name("role1")
                .type("Account")
                .resourceIds(List.of(1L,2L))
                .build();
        log.info("creating role 1 {}",  roleReq1);
        roleService.create(roleReq1);

        RoleReq roleReq2 = RoleReq.builder()
                .name("role1")
                .type("Client")
                .resourceIds(List.of(1L))
                .build();
        log.info("creating role 2 {}",  roleReq2);
        roleService.create(roleReq2);

    }

}
