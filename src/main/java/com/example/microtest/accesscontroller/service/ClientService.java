package com.example.microtest.accesscontroller.service;

import com.example.microtest.accesscontroller.payload.request.ClientReq;
import com.example.microtest.accesscontroller.payload.response.ClientRes;

import java.util.List;
import java.util.Optional;

public interface ClientService {

    ClientRes create(ClientReq clientReq);

    ClientRes update(ClientReq clientReq);

    void deleteById(Long id);

    List<ClientRes> findAllByExample(ClientReq example);

    Optional<ClientRes> findById(Long id);
}
