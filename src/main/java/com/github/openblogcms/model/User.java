package com.github.openblogcms.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private int role;

    public User() {}

    public User(String username, String password, int role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }
}

