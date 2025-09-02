package com.example.microtest.accesscontroller.controller;

import com.example.microtest.accesscontroller.domain.Account;
import com.example.microtest.accesscontroller.payload.request.AccountReq;
import com.example.microtest.accesscontroller.payload.request.AuthenticationRequest;
import com.example.microtest.accesscontroller.payload.request.AuthorizationRequest;
import com.example.microtest.accesscontroller.payload.response.AccountRes;
import com.example.microtest.accesscontroller.payload.response.AuthenticationResponse;
import com.example.microtest.accesscontroller.payload.response.AuthorizationResponse;
import com.example.microtest.accesscontroller.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
@Tag(name = "Account Management", description = "APIs for managing accounts, authentication, and authorization")
public class AccountController {

    private final AccountService accountService;

    @PostMapping("/authenticate")
    @Operation(summary = "Authenticate user", description = "Authenticate a user with username, password, and client secret")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Authentication successful",
                    content = @Content(schema = @Schema(implementation = AuthenticationResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request parameters"),
            @ApiResponse(responseCode = "401", description = "Authentication failed")
    })
    public ResponseEntity<AuthenticationResponse> authenticate(
            @Parameter(description = "Authentication request containing credentials", required = true)
            @RequestBody AuthenticationRequest authenticationRequest) {
        return ResponseEntity.ok(accountService.authenticate(authenticationRequest));
    }

    @PostMapping("/check-access")
    @Operation(summary = "Check resource access", description = "Check if a user has access to a specific resource")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Access check completed",
                    content = @Content(schema = @Schema(implementation = AuthorizationResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request parameters"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<AuthorizationResponse> checkAccess(
            @Parameter(description = "Authorization request containing access token and resource details", required = true)
            @RequestBody AuthorizationRequest authorizationRequest) {
        return ResponseEntity.ok(accountService.checkAccess(authorizationRequest));
    }

    @PostMapping("/create")
    @Operation(summary = "Create account", description = "Create a new account")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Account created successfully",
                    content = @Content(schema = @Schema(implementation = Account.class))),
            @ApiResponse(responseCode = "400", description = "Invalid account data")
    })
    public ResponseEntity<AccountRes> create(
            @Parameter(description = "Account details to create", required = true)
            @RequestBody AccountReq accountReq) {
        AccountRes createdAccount = accountService.create(accountReq);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAccount);
    }

    @PostMapping("/update")
    public ResponseEntity<AccountRes> update(@RequestBody AccountReq accountReq) {
        AccountRes updatedAccount = accountService.update(accountReq);
        return ResponseEntity.ok(updatedAccount);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        accountService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/findAll")
    public ResponseEntity<List<AccountRes>> findAllByExample(@RequestBody AccountReq example) {
        List<AccountRes> accounts = accountService.findAllByExample(example);
        return ResponseEntity.ok(accounts);
    }

    @PostMapping("/findById")
    public ResponseEntity<AccountRes> findById(@RequestBody Long id) {
        Optional<AccountRes> account = accountService.findById(id);
        return account.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
