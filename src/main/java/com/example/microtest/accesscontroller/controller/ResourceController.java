package com.example.microtest.accesscontroller.controller;

import com.example.microtest.accesscontroller.payload.request.ResourceReq;
import com.example.microtest.accesscontroller.payload.response.ResourceRes;
import com.example.microtest.accesscontroller.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class ResourceController {

    private final ResourceService resourceService;

    @PostMapping("/create")
    public ResponseEntity<ResourceRes> create(@RequestBody ResourceReq resourceReq) {
        ResourceRes createdResource = resourceService.create(resourceReq);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdResource);
    }

    @PostMapping("/update")
    public ResponseEntity<ResourceRes> update(@RequestBody ResourceReq resourceReq) {
        ResourceRes updatedResource = resourceService.update(resourceReq);
        return ResponseEntity.ok(updatedResource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        resourceService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/findAll")
    public ResponseEntity<List<ResourceRes>> findAllByExample(@RequestBody ResourceReq example) {
        List<ResourceRes> resources = resourceService.findAllByExample(example);
        return ResponseEntity.ok(resources);
    }

    @PostMapping("/findById")
    public ResponseEntity<ResourceRes> findById(@RequestBody Long id) {
        Optional<ResourceRes> resource = resourceService.findById(id);
        return resource.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
