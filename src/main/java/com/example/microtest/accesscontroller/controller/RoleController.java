package com.example.microtest.accesscontroller.controller;

import com.example.microtest.accesscontroller.payload.request.RoleReq;
import com.example.microtest.accesscontroller.payload.response.RoleRes;
import com.example.microtest.accesscontroller.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class RoleController {

    private final RoleService roleService;

    @PostMapping("/create")
    public ResponseEntity<RoleRes> create(@RequestBody RoleReq roleReq) {
        RoleRes createdRole = roleService.create(roleReq);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRole);
    }

    @PostMapping("/update")
    public ResponseEntity<RoleRes> update(@RequestBody RoleReq roleReq) {
        RoleRes updatedRole = roleService.update(roleReq);
        return ResponseEntity.ok(updatedRole);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        roleService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/findAll")
    public ResponseEntity<List<RoleRes>> findAllByExample(@RequestBody RoleReq example) {
        List<RoleRes> roles = roleService.findAllByExample(example);
        return ResponseEntity.ok(roles);
    }

    @PostMapping("/findById")
    public ResponseEntity<RoleRes> findById(@RequestBody Long id) {
        Optional<RoleRes> role = roleService.findById(id);
        return role.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
