package com.example.microtest.accesscontroller.controller;

import com.example.microtest.accesscontroller.payload.request.ClientReq;
import com.example.microtest.accesscontroller.payload.response.ClientRes;
import com.example.microtest.accesscontroller.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class ClientController {

    private final ClientService clientService;

    @PostMapping("/create")
    public ResponseEntity<ClientRes> create(@RequestBody ClientReq clientReq) {
        ClientRes createdClient = clientService.create(clientReq);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdClient);
    }

    @PostMapping("/update")
    public ResponseEntity<ClientRes> update(@RequestBody ClientReq clientReq) {
        ClientRes updatedClient = clientService.update(clientReq);
        return ResponseEntity.ok(updatedClient);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        clientService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/findAll")
    public ResponseEntity<List<ClientRes>> findAllByExample(@RequestBody ClientReq example) {
        List<ClientRes> clients = clientService.findAllByExample(example);
        return ResponseEntity.ok(clients);
    }

    @PostMapping("/findById")
    public ResponseEntity<ClientRes> findById(@RequestBody Long id) {
        Optional<ClientRes> client = clientService.findById(id);
        return client.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
