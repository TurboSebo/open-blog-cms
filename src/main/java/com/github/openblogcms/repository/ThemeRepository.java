package com.github.openblogcms.repository;

import com.github.openblogcms.model.ThemeConfig;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ThemeRepository extends JpaRepository<ThemeConfig, Long> {
    // Dodatkowe metody zapytań mogą być zdefiniowane tutaj, jeśli to konieczne
}