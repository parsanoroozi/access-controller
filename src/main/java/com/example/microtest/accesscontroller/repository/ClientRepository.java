package com.example.microtest.accesscontroller.repository;

import com.example.microtest.accesscontroller.domain.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
}
