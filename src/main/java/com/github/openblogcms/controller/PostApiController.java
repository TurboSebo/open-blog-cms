package com.github.openblogcms.controller;

import com.github.openblogcms.model.Post;
import com.github.openblogcms.repository.PostRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController // Mówi Springowi TO JEST REST API (zwraca JSON)
@RequestMapping("/api/posts") // Wszystkie metody tutaj zaczynają się od /api/posts
public class PostApiController {

    private final PostRepository postRepository;

    public PostApiController(PostRepository postRepository) {   // Wstrzykiwanie zależności (Dependency Injection)
        this.postRepository = postRepository;
    }

    // GET /api/posts - Pobierz wszystkie posty (posortowane)
    @GetMapping
    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    // POST /api/posts - Dodaj nowy post
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        if (post.getTitle() == null || post.getTitle().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tytuł posta jest wymagany");
        }
        if (post.getContent() == null || post.getContent().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Treść posta jest wymagana");
        }
        post.setCreatedAt(java.time.LocalDateTime.now());
        post.setUpdatedAt(java.time.LocalDateTime.now());
        Post saved = postRepository.save(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // PUT /api/posts/{id} - Edytuj post (np. zmiana tytułu lub publikacja)
    @PutMapping("/{id}")
    public Post updatePost(@PathVariable Long id, @RequestBody Post updatedPostData) {
        return postRepository.findById(id)
                .map(post -> {
                    if (updatedPostData.getTitle() != null) {
                        if (updatedPostData.getTitle().isBlank()) {
                            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tytuł posta nie może być pusty");
                        }
                        post.setTitle(updatedPostData.getTitle());
                    }
                    if (updatedPostData.getContent() != null) {
                        if (updatedPostData.getContent().isBlank()) {
                            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Treść posta nie może być pusta");
                        }
                        post.setContent(updatedPostData.getContent());
                    }
                    post.setPublished(updatedPostData.isPublished());
                    post.setUpdatedAt(java.time.LocalDateTime.now());
                    return postRepository.save(post);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post nie znaleziony"));
    }

    // DELETE /api/posts/{id} - Usuń post
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(@PathVariable Long id) {
        if (!postRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post nie znaleziony");
        }
        postRepository.deleteById(id);
    }
}