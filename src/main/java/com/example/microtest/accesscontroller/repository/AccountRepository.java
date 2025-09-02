package com.example.microtest.accesscontroller.repository;

import com.example.microtest.accesscontroller.domain.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
}
