package com.example.microtest.accesscontroller.repository;

import com.example.microtest.accesscontroller.domain.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
}
