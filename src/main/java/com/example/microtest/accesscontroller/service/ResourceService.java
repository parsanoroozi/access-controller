package com.example.microtest.accesscontroller.service;

import com.example.microtest.accesscontroller.payload.request.ResourceReq;
import com.example.microtest.accesscontroller.payload.response.ResourceRes;

import java.util.List;
import java.util.Optional;

public interface ResourceService {

    ResourceRes create(ResourceReq resourceReq);

    ResourceRes update(ResourceReq resourceReq);

    void deleteById(Long id);

    List<ResourceRes> findAllByExample(ResourceReq example);

    Optional<ResourceRes> findById(Long id);
}
