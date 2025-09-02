package com.example.microtest.accesscontroller.service.impl;

import com.example.microtest.accesscontroller.domain.Resource;
import com.example.microtest.accesscontroller.domain.Role;
import com.example.microtest.accesscontroller.payload.request.RoleReq;
import com.example.microtest.accesscontroller.payload.response.RoleRes;
import com.example.microtest.accesscontroller.payload.response.ResponseMapper;
import com.example.microtest.accesscontroller.repository.ResourceRepository;
import com.example.microtest.accesscontroller.repository.RoleRepository;
import com.example.microtest.accesscontroller.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final ResourceRepository resourceRepository;

    @Override
    public RoleRes create(RoleReq roleReq) {
        List<Resource> resources = new ArrayList<>();
        if (roleReq.getResourceIds() != null && !roleReq.getResourceIds().isEmpty()) {
            for (Long resourceId : roleReq.getResourceIds()) {
                Resource resource = resourceRepository.findById(resourceId)
                        .orElseThrow(() -> new RuntimeException("Resource not found with ID: " + resourceId));
                resources.add(resource);
            }
        }

        Role role = Role.builder()
                .name(roleReq.getName())
                .type(roleReq.getType())
                .resources(resources)
                .build();

        Role savedRole = roleRepository.save(role);
        return ResponseMapper.toRoleResponse(savedRole);
    }

    @Override
    public RoleRes update(RoleReq roleReq) {
        if (roleReq.getId() == null) {
            throw new IllegalArgumentException("Role ID cannot be null for update operation");
        }

        Role existingRole = roleRepository.findById(roleReq.getId())
                .orElseThrow(() -> new IllegalArgumentException("Role not found with ID: " + roleReq.getId()));

        List<Resource> resources = new ArrayList<>();
        if (roleReq.getResourceIds() != null && !roleReq.getResourceIds().isEmpty()) {
            for (Long resourceId : roleReq.getResourceIds()) {
                Resource resource = resourceRepository.findById(resourceId)
                        .orElseThrow(() -> new RuntimeException("Resource not found with ID: " + resourceId));
                resources.add(resource);
            }
        }

        existingRole.setName(roleReq.getName());
        existingRole.setType(roleReq.getType());
        existingRole.setResources(resources);

        Role savedRole = roleRepository.save(existingRole);
        return ResponseMapper.toRoleResponse(savedRole);
    }

    @Override
    public void deleteById(Long id) {
        roleRepository.deleteById(id);
    }

    @Override
    public List<RoleRes> findAllByExample(RoleReq example) {
        Role role = Role.builder()
                .id(example.getId())
                .name(example.getName())
                .type(example.getType())
                .build();
        List<Role> roles = roleRepository.findAll(Example.of(role));
        return ResponseMapper.toRoleResponseList(roles);
    }

    @Override
    public Optional<RoleRes> findById(Long id) {
        Optional<Role> role = roleRepository.findById(id);
        return role.map(ResponseMapper::toRoleResponse);
    }
}
