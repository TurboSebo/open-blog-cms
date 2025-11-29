package com.github.openblogcms.repository;

import com.github.openblogcms.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    // Spring sam utworzy zapytanie SQL, żeby znaleźć najnowsze posty
    List<Post> findAllByOrderByCreatedAtDesc();
}