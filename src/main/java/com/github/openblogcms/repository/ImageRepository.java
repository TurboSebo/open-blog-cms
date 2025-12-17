package com.github.openblogcms.repository;

import com.github.openblogcms.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {
}

