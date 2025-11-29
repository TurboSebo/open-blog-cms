package com.github.openblogcms.controller;

import com.github.openblogcms.model.Post;
import com.github.openblogcms.repository.PostRepository;
import org.springframework.web.bind.annotation.*;

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
    public Post createPost(@RequestBody Post post) {
        // Zmuszamy, by nowy post miał aktualne daty
        post.setCreatedAt(java.time.LocalDateTime.now());
        post.setUpdatedAt(java.time.LocalDateTime.now());
        return postRepository.save(post);
    }

    // PUT /api/posts/{id} - Edytuj post (np. zmiana tytułu lub publikacja)
    @PutMapping("/{id}")
    public Post updatePost(@PathVariable Long id, @RequestBody Post updatedPostData) {
        return postRepository.findById(id)
                .map(post -> {
                    // Aktualizujemy pola tylko, jeśli przyszły w żądaniu
                    if (updatedPostData.getTitle() != null) post.setTitle(updatedPostData.getTitle());
                    if (updatedPostData.getContent() != null) post.setContent(updatedPostData.getContent());

                    // Tutaj jest mały trik: w JS przesyłasz boolean, więc zawsze nadpisujemy
                    post.setPublished(updatedPostData.isPublished());

                    return postRepository.save(post);
                })
                .orElseThrow(() -> new RuntimeException("Post nie znaleziony o id: " + id));
    }

    // DELETE /api/posts/{id} - Usuń post
    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable Long id) {
        postRepository.deleteById(id);
    }
}