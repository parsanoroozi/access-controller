package com.example.microtest.accesscontroller.service;

import com.example.microtest.accesscontroller.payload.request.AccountReq;
import com.example.microtest.accesscontroller.payload.request.AuthenticationRequest;
import com.example.microtest.accesscontroller.payload.request.AuthorizationRequest;
import com.example.microtest.accesscontroller.payload.response.AccountRes;
import com.example.microtest.accesscontroller.payload.response.AuthenticationResponse;
import com.example.microtest.accesscontroller.payload.response.AuthorizationResponse;

import java.util.List;
import java.util.Optional;

public interface AccountService {

    AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest);

    AuthorizationResponse checkAccess(AuthorizationRequest authorizationRequest);

    AccountRes create(AccountReq accountReq);

    AccountRes update(AccountReq accountReq);

    void deleteById(Long id);

    List<AccountRes> findAllByExample(AccountReq example);

    Optional<AccountRes> findById(Long id);
}
