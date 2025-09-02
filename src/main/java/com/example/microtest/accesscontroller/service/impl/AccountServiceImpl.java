package com.example.microtest.accesscontroller.service.impl;

import com.example.microtest.accesscontroller.domain.Account;
import com.example.microtest.accesscontroller.domain.Client;
import com.example.microtest.accesscontroller.domain.Resource;
import com.example.microtest.accesscontroller.domain.Role;
import com.example.microtest.accesscontroller.payload.request.AccountReq;
import com.example.microtest.accesscontroller.payload.request.AuthenticationRequest;
import com.example.microtest.accesscontroller.payload.request.AuthorizationRequest;
import com.example.microtest.accesscontroller.payload.response.AccountRes;
import com.example.microtest.accesscontroller.payload.response.AuthenticationResponse;
import com.example.microtest.accesscontroller.payload.response.AuthorizationResponse;
import com.example.microtest.accesscontroller.payload.response.ResponseMapper;
import com.example.microtest.accesscontroller.repository.AccountRepository;
import com.example.microtest.accesscontroller.repository.ClientRepository;
import com.example.microtest.accesscontroller.repository.RoleRepository;
import com.example.microtest.accesscontroller.service.AccountService;
import com.example.microtest.accesscontroller.service.JwtService;
import com.example.microtest.accesscontroller.service.PasswordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final ClientRepository clientRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;
    private final PasswordService passwordService;

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest) {
        try {
            // Input validation
            if (Objects.isNull(authenticationRequest.getClientSecret()) ||
                    Objects.isNull(authenticationRequest.getUsername()) ||
                    Objects.isNull(authenticationRequest.getPassword())) {
                log.warn("Authentication attempt with missing credentials");
                return AuthenticationResponse.builder()
                        .authenticated(false)
                        .description("Invalid request parameters")
                        .build();
            }

            // Validate client
            List<Client> recognizedClients = clientRepository.findAll(
                    Example.of(
                            Client.builder()
                                    .secret(authenticationRequest.getClientSecret())
                                    .build()
                    )
            );

            if (recognizedClients.isEmpty()) {
                log.warn("Authentication attempt with invalid client secret");
                return AuthenticationResponse.builder()
                        .authenticated(false)
                        .description("Authentication failed")
                        .build();
            }

            Client client = recognizedClients.get(0);

            // Find account
            Optional<Account> accountOpt = accountRepository.findOne(
                    Example.of(
                            Account.builder()
                                    .username(authenticationRequest.getUsername())
                                    .build()
                    )
            );

            if (accountOpt.isEmpty()) {
                log.warn("Authentication attempt for non-existent user: {}", authenticationRequest.getUsername());
                return AuthenticationResponse.builder()
                        .authenticated(false)
                        .description("Authentication failed")
                        .build();
            }

            Account account = accountOpt.get();

            // Validate account belongs to client
            if (!Objects.equals(account.getClient().getId(), client.getId())) {
                log.warn("User {} does not belong to client {}", account.getUsername(), client.getId());
                return AuthenticationResponse.builder()
                        .authenticated(false)
                        .description("Authentication failed")
                        .build();
            }

            // Validate password (assuming passwords are now hashed)
            if (!passwordService.matches(authenticationRequest.getPassword(), account.getPassword())) {
                log.warn("Invalid password for user: {}", account.getUsername());
                return AuthenticationResponse.builder()
                        .authenticated(false)
                        .description("Authentication failed")
                        .build();
            }

            // Generate tokens
            String accessToken = jwtService.generateAccessToken(account.getUsername(), client.getId().toString());
            String refreshToken = jwtService.generateRefreshToken(account.getUsername(), client.getId().toString());

            log.info("Successful authentication for user: {} in client: {}", account.getUsername(), client.getId());

            if (Boolean.TRUE.equals(client.getHasPassiveAccessControl())) {
                return AuthenticationResponse.builder()
                        .authenticated(true)
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .resources(account.getRole().getResources())
                        .description("Successfully authenticated with passive access control enabled")
                        .build();
            }

            return AuthenticationResponse.builder()
                    .authenticated(true)
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .description("Successfully authenticated with passive access control disabled")
                    .build();

        } catch (Exception e) {
            log.error("Error during authentication", e);
            return AuthenticationResponse.builder()
                    .authenticated(false)
                    .description("Internal server error")
                    .build();
        }
    }

    @Override
    public AuthorizationResponse checkAccess(AuthorizationRequest authorizationRequest) {
        try {
            // Input validation
            if (Objects.isNull(authorizationRequest.getClientSecret()) ||
                    Objects.isNull(authorizationRequest.getAccessToken()) ||
                    Objects.isNull(authorizationRequest.getUsername()) ||
                    Objects.isNull(authorizationRequest.getResourceName())) {
                log.warn("Authorization attempt with missing parameters");
                return AuthorizationResponse.builder()
                        .authenticated(false)
                        .allowed(false)
                        .description("Invalid request parameters")
                        .build();
            }

            // Validate client
            List<Client> recognizedClients = clientRepository.findAll(
                    Example.of(
                            Client.builder()
                                    .secret(authorizationRequest.getClientSecret())
                                    .build()
                    )
            );

            if (recognizedClients.isEmpty()) {
                log.warn("Authorization attempt with invalid client secret");
                return AuthorizationResponse.builder()
                        .authenticated(false)
                        .allowed(false)
                        .description("Authorization failed")
                        .build();
            }

            Client client = recognizedClients.get(0);

            // Validate access token
            if (!jwtService.validateToken(authorizationRequest.getAccessToken())) {
                log.warn("Authorization attempt with invalid access token");
                return AuthorizationResponse.builder()
                        .authenticated(false)
                        .allowed(false)
                        .description("Invalid or expired token")
                        .build();
            }

            // Extract and validate token claims
            String tokenUsername = jwtService.extractUsername(authorizationRequest.getAccessToken());
            String tokenClientId = jwtService.extractClientId(authorizationRequest.getAccessToken());

            if (!Objects.equals(tokenUsername, authorizationRequest.getUsername()) ||
                    !Objects.equals(tokenClientId, client.getId().toString())) {
                log.warn("Token claims mismatch for user: {}", authorizationRequest.getUsername());
                return AuthorizationResponse.builder()
                        .authenticated(false)
                        .allowed(false)
                        .description("Token validation failed")
                        .build();
            }

            // Find account
            Optional<Account> accountOpt = accountRepository.findOne(
                    Example.of(
                            Account.builder()
                                    .username(authorizationRequest.getUsername())
                                    .build()
                    )
            );

            if (accountOpt.isEmpty()) {
                log.warn("Authorization attempt for non-existent user: {}", authorizationRequest.getUsername());
                return AuthorizationResponse.builder()
                        .authenticated(false)
                        .allowed(false)
                        .description("Authorization failed")
                        .build();
            }

            Account account = accountOpt.get();

            // Validate account belongs to client
            if (!Objects.equals(account.getClient().getId(), client.getId())) {
                log.warn("User {} does not belong to client {}", account.getUsername(), client.getId());
                return AuthorizationResponse.builder()
                        .authenticated(false)
                        .allowed(false)
                        .description("Authorization failed")
                        .build();
            }

            // Check if resource belongs to client
            boolean resourceBelongsToClient = client.getResources() != null &&
                    client.getResources().stream()
                            .map(Resource::getName)
                            .anyMatch(name -> Objects.equals(name, authorizationRequest.getResourceName()));

            if (!resourceBelongsToClient) {
                log.warn("Resource {} does not belong to client {}", authorizationRequest.getResourceName(), client.getId());
                return AuthorizationResponse.builder()
                        .authenticated(true)
                        .allowed(false)
                        .description("Resource not found in client")
                        .build();
            }

            // Check if user has access to the resource
            boolean userHasAccess = account.getRole().getResources() != null &&
                    account.getRole().getResources().stream()
                            .filter(resource -> Objects.equals(resource.getClient().getId(), client.getId()))
                            .map(Resource::getName)
                            .anyMatch(name -> Objects.equals(name, authorizationRequest.getResourceName()));

            if (!userHasAccess) {
                log.warn("User {} does not have access to resource {} in client {}",
                        account.getUsername(), authorizationRequest.getResourceName(), client.getId());
                return AuthorizationResponse.builder()
                        .authenticated(true)
                        .allowed(false)
                        .description("Access denied to resource")
                        .build();
            }

            // Generate new tokens for security
            String newAccessToken = jwtService.generateAccessToken(account.getUsername(), client.getId().toString());
            String newRefreshToken = jwtService.generateRefreshToken(account.getUsername(), client.getId().toString());

            log.info("Access granted for user: {} to resource: {} in client: {}",
                    account.getUsername(), authorizationRequest.getResourceName(), client.getId());

            return AuthorizationResponse.builder()
                    .authenticated(true)
                    .allowed(true)
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .description("Access granted")
                    .build();

        } catch (Exception e) {
            log.error("Error during authorization", e);
            return AuthorizationResponse.builder()
                    .authenticated(false)
                    .allowed(false)
                    .description("Internal server error")
                    .build();
        }
    }

    @Override
    public AccountRes create(AccountReq accountReq) {
        Client client = null;
        if (accountReq.getClientId() != null) {
            client = clientRepository.findById(accountReq.getClientId())
                    .orElseThrow(() -> new IllegalArgumentException("Client not found with ID: " + accountReq.getClientId()));
        }

        Role role = null;
        if (accountReq.getRoleId() != null) {
            role = roleRepository.findById(accountReq.getRoleId())
                    .orElseThrow(() -> new IllegalArgumentException("Role not found with ID: " + accountReq.getRoleId()));
        }

        Account account = Account.builder()
                .username(accountReq.getUsername())
                .password(passwordService.encodePassword(accountReq.getPassword()))
                .client(client)
                .role(role)
                .build();
        Account savedAccount = accountRepository.save(account);
        return ResponseMapper.toAccountResponse(savedAccount);
    }

    @Override
    public AccountRes update(AccountReq accountReq) {
        if (accountReq.getId() == null) {
            throw new IllegalArgumentException("Account ID cannot be null for update operation");
        }

        Account existingAccount = accountRepository.findById(accountReq.getId())
                .orElseThrow(() -> new IllegalArgumentException("Account not found with ID: " + accountReq.getId()));

        Client client = null;
        if (accountReq.getClientId() != null) {
            client = clientRepository.findById(accountReq.getClientId())
                    .orElseThrow(() -> new IllegalArgumentException("Client not found with ID: " + accountReq.getRoleId()));
        }

        Role role = null;
        if (accountReq.getRoleId() != null) {
            role = roleRepository.findById(accountReq.getRoleId())
                    .orElseThrow(() -> new IllegalArgumentException("Role not found with ID: " + accountReq.getRoleId()));
        }

        existingAccount.setUsername(accountReq.getUsername());
        if (accountReq.getPassword() != null && !accountReq.getPassword().trim().isEmpty()) {
            existingAccount.setPassword(passwordService.encodePassword(accountReq.getPassword()));
        }
        existingAccount.setClient(client);
        existingAccount.setRole(role);

        Account savedAccount = accountRepository.save(existingAccount);
        return ResponseMapper.toAccountResponse(savedAccount);
    }

    @Override
    public void deleteById(Long id) {
        accountRepository.deleteById(id);
    }

    @Override
    public List<AccountRes> findAllByExample(AccountReq example) {
        Account account = Account.builder()
                .id(example.getId())
                .username(example.getUsername())
                .build();
        List<Account> accounts = accountRepository.findAll(Example.of(account));
        return ResponseMapper.toAccountResponseList(accounts);
    }

    @Override
    public Optional<AccountRes> findById(Long id) {
        Optional<Account> account = accountRepository.findById(id);
        return account.map(ResponseMapper::toAccountResponse);
    }
}
