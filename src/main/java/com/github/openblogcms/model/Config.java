package com.github.openblogcms.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "config")
public class Config {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "config_key", unique = true, nullable = false, length = 100)
    private String key;

    @Lob
    @Column(name = "config_value")
    private String value;
}
