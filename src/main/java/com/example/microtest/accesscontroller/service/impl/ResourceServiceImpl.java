package com.example.microtest.accesscontroller.service.impl;

import com.example.microtest.accesscontroller.domain.Client;
import com.example.microtest.accesscontroller.domain.Resource;
import com.example.microtest.accesscontroller.payload.request.ResourceReq;
import com.example.microtest.accesscontroller.payload.response.ResourceRes;
import com.example.microtest.accesscontroller.payload.response.ResponseMapper;
import com.example.microtest.accesscontroller.repository.ResourceRepository;
import com.example.microtest.accesscontroller.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    @Override
    public ResourceRes create(ResourceReq resourceReq) {
        Resource resource = Resource.builder()
                .id(resourceReq.getId())
                .name(resourceReq.getName())
                .type(resourceReq.getType())
                .url(resourceReq.getUrl())
                .action(resourceReq.getAction())
                .client(Objects.isNull(resourceReq.getClientId()) ? null : Client.builder().id(resourceReq.getClientId()).build())
                .build();
        Resource savedResource = resourceRepository.save(resource);
        return ResponseMapper.toResourceResponse(savedResource);
    }

    @Override
    public ResourceRes update(ResourceReq resourceReq) {
        if (resourceReq.getId() == null) {
            throw new IllegalArgumentException("Resource ID cannot be null for update operation");
        }
        
        Resource existingResource = resourceRepository.findById(resourceReq.getId())
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with ID: " + resourceReq.getId()));
        
        existingResource.setName(resourceReq.getName());
        existingResource.setType(resourceReq.getType());
        existingResource.setUrl(resourceReq.getUrl());
        existingResource.setAction(resourceReq.getAction());
        existingResource.setClient(Objects.isNull(resourceReq.getClientId()) ? null : Client.builder().id(resourceReq.getClientId()).build());
        
        Resource savedResource = resourceRepository.save(existingResource);
        return ResponseMapper.toResourceResponse(savedResource);
    }

    @Override
    public void deleteById(Long id) {
        resourceRepository.deleteById(id);
    }

    @Override
    public List<ResourceRes> findAllByExample(ResourceReq example) {
        Resource resource = Resource.builder()
                .id(example.getId())
                .name(example.getName())
                .type(example.getType())
                .url(example.getUrl())
                .action(example.getAction())
                .client(Objects.isNull(example.getClientId()) ? null : Client.builder().id(example.getClientId()).build())
                .build();
        List<Resource> resources = resourceRepository.findAll(Example.of(resource));
        return ResponseMapper.toResourceResponseList(resources);
    }

    @Override
    public Optional<ResourceRes> findById(Long id) {
        Optional<Resource> resource = resourceRepository.findById(id);
        return resource.map(ResponseMapper::toResourceResponse);
    }
}
