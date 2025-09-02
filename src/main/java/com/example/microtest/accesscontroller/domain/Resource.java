package com.example.microtest.accesscontroller.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @EqualsAndHashCode.Include
    private Long id;

    private String name;

    private String type; // api-endpoint, web-page, web-page-component

    private String url;

    private String action;

    @ManyToOne
    @JoinColumn(name = "client_id", referencedColumnName = "id")
    @JsonManagedReference(value = "resource_client")
    @ToString.Exclude
    private Client client;

    @ManyToMany(mappedBy = "resources", fetch = FetchType.LAZY)
    @JsonBackReference("resource_role")
    @ToString.Exclude
    private List<Role> roles;

}
