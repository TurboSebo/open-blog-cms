package com.github.openblogcms.model;

import jakarta.persistence.*;
import lombok.Data; // Lombok tworzy za nas gettery/settery
import java.time.LocalDateTime;

@Data // Generuje gettery, settery, toString, equals itp.
@Entity // Tworzy tabelę w bazie
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT") // Pozwala na długi tekst
    private String content;

    private boolean published = false; // Domyślnie szkic

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Post() {     // Konstruktor bezargumentowy jest wymagany przez JPA
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Automatyczna aktualizacja daty przy edycji
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}