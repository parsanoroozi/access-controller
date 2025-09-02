package com.example.microtest.accesscontroller.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @EqualsAndHashCode.Include
    private Long id;

    private String name;

    private String secret;

    private Boolean hasPassiveAccessControl;

    @OneToMany(mappedBy = "client")
    @JsonBackReference("resource_client")
    @ToString.Exclude
    private List<Resource> resources;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    @ToString.Exclude
    private Role role;

    @OneToMany(mappedBy = "client", fetch = FetchType.LAZY)
    @JsonBackReference("account_client")
    @ToString.Exclude
    private List<Account> accounts;

}
