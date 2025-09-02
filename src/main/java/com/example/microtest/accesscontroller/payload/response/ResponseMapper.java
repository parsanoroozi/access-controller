package com.example.microtest.accesscontroller.payload.response;

import com.example.microtest.accesscontroller.domain.Account;
import com.example.microtest.accesscontroller.domain.Client;
import com.example.microtest.accesscontroller.domain.Resource;
import com.example.microtest.accesscontroller.domain.Role;

import java.util.List;
import java.util.stream.Collectors;

public class ResponseMapper {

    public static AccountRes toAccountResponse(Account account) {
        if (account == null) return null;

        return AccountRes.builder()
                .id(account.getId())
                .username(account.getUsername())
                .password(account.getPassword())
                .client(ClientSummary.builder()
                        .id(account.getClient() != null ? account.getClient().getId() : null)
                        .name(account.getClient() != null ? account.getClient().getName() : null)
                        .build())
                .role(account.getRole() != null ? toRoleResponse(account.getRole()) : null)
                .build();
    }

    public static ClientRes toClientResponse(Client client) {
        if (client == null) return null;

        return ClientRes.builder()
                .id(client.getId())
                .name(client.getName())
                .secret(client.getSecret())
                .hasPassiveAccessControl(client.getHasPassiveAccessControl())
                .role(client.getRole() != null ? toRoleResponse(client.getRole()) : null)
                .build();
    }

    public static ResourceRes toResourceResponse(Resource resource) {
        if (resource == null) return null;

        return ResourceRes.builder()
                .id(resource.getId())
                .name(resource.getName())
                .type(resource.getType())
                .url(resource.getUrl())
                .action(resource.getAction())
                .client(ClientSummary.builder()
                        .id(resource.getClient() != null ? resource.getClient().getId() : null)
                        .name(resource.getClient() != null ? resource.getClient().getName() : null)
                        .build())
                .build();
    }

    public static RoleRes toRoleResponse(Role role) {
        if (role == null) return null;

        List<ResourceRes> resources = null;
        if (role.getResources() != null) {
            resources = role.getResources().stream()
                    .map(ResponseMapper::toResourceResponse)
                    .toList();
        }

        return RoleRes.builder()
                .id(role.getId())
                .name(role.getName())
                .type(role.getType())
                .resources(resources)
                .build();
    }

    public static List<AccountRes> toAccountResponseList(List<Account> accounts) {
        if (accounts == null) return null;
        return accounts.stream()
                .map(ResponseMapper::toAccountResponse)
                .collect(Collectors.toList());
    }

    public static List<ClientRes> toClientResponseList(List<Client> clients) {
        if (clients == null) return null;
        return clients.stream()
                .map(ResponseMapper::toClientResponse)
                .collect(Collectors.toList());
    }

    public static List<ResourceRes> toResourceResponseList(List<Resource> resources) {
        if (resources == null) return null;
        return resources.stream()
                .map(ResponseMapper::toResourceResponse)
                .collect(Collectors.toList());
    }

    public static List<RoleRes> toRoleResponseList(List<Role> roles) {
        if (roles == null) return null;
        return roles.stream()
                .map(ResponseMapper::toRoleResponse)
                .collect(Collectors.toList());
    }
}
