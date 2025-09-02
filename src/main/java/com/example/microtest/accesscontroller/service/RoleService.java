package com.example.microtest.accesscontroller.service;

import com.example.microtest.accesscontroller.domain.Role;
import com.example.microtest.accesscontroller.payload.request.RoleReq;
import com.example.microtest.accesscontroller.payload.response.RoleRes;

import java.util.List;
import java.util.Optional;

public interface RoleService {
    
    RoleRes create(RoleReq roleReq);
    
    RoleRes update(RoleReq roleReq);
    
    void deleteById(Long id);
    
    List<RoleRes> findAllByExample(RoleReq example);
    
    Optional<RoleRes> findById(Long id);
}
