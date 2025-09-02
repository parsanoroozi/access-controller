package com.example.microtest.accesscontroller.service.impl;

import com.example.microtest.accesscontroller.domain.Client;
import com.example.microtest.accesscontroller.domain.Role;
import com.example.microtest.accesscontroller.payload.request.ClientReq;
import com.example.microtest.accesscontroller.payload.response.ClientRes;
import com.example.microtest.accesscontroller.payload.response.ResponseMapper;
import com.example.microtest.accesscontroller.repository.ClientRepository;
import com.example.microtest.accesscontroller.repository.RoleRepository;
import com.example.microtest.accesscontroller.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final RoleRepository roleRepository;

    @Override
    public ClientRes create(ClientReq clientReq) {
        Role role = null;
        if (Objects.nonNull(clientReq.getRoleId())) {
            role = roleRepository.findById(clientReq.getRoleId())
                    .orElseThrow(() -> new IllegalArgumentException("Role not found with ID: " + clientReq.getRoleId()));
        }

        Client client = Client.builder()
                .name(clientReq.getName())
                .secret(clientReq.getSecret())
                .hasPassiveAccessControl(clientReq.getHasPassiveAccessControl())
                .role(role)
                .build();

        Client savedClient = clientRepository.save(client);
        return ResponseMapper.toClientResponse(savedClient);
    }

    @Override
    public ClientRes update(ClientReq clientReq) {
        if (clientReq.getId() == null) {
            throw new IllegalArgumentException("Client ID cannot be null for update operation");
        }

        Client existingClient = clientRepository.findById(clientReq.getId())
                .orElseThrow(() -> new IllegalArgumentException("Client not found with ID: " + clientReq.getId()));

        Role role = null;
        if (Objects.nonNull(clientReq.getRoleId())) {
            role = roleRepository.findById(clientReq.getRoleId())
                    .orElseThrow(() -> new IllegalArgumentException("Role not found with ID: " + clientReq.getRoleId()));
        }

        existingClient.setName(clientReq.getName());
        existingClient.setSecret(clientReq.getSecret());
        existingClient.setHasPassiveAccessControl(clientReq.getHasPassiveAccessControl());
        existingClient.setRole(role);

        Client savedClient = clientRepository.save(existingClient);
        return ResponseMapper.toClientResponse(savedClient);
    }

    @Override
    public void deleteById(Long id) {
        clientRepository.deleteById(id);
    }

    @Override
    public List<ClientRes> findAllByExample(ClientReq example) {
        Client client = Client.builder()
                .id(example.getId())
                .name(example.getName())
                .secret(example.getSecret())
                .hasPassiveAccessControl(example.getHasPassiveAccessControl())
                .role(Objects.isNull(example.getRoleId()) ? null : Role.builder().id(example.getRoleId()).build())
                .build();
        List<Client> clients = clientRepository.findAll(Example.of(client));
        return ResponseMapper.toClientResponseList(clients);
    }

    @Override
    public Optional<ClientRes> findById(Long id) {
        Optional<Client> client = clientRepository.findById(id);
        return client.map(ResponseMapper::toClientResponse);
    }
}
